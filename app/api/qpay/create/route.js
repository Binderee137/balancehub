// QPay token авах
async function getQPayToken() {
  const res = await fetch("https://merchant.qpay.mn/v2/auth/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.QPAY_USERNAME}:${process.env.QPAY_PASSWORD}`
        ).toString("base64"),
    },
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(request) {
  const { plan, profileId } = await request.json();

  const prices = { monthly: 9900, yearly: 89900 };
  const amount = prices[plan] || prices.monthly;

  try {
    const token = await getQPayToken();

    const invoiceRes = await fetch("https://merchant.qpay.mn/v2/invoice", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoice_code: process.env.QPAY_INVOICE_CODE,
        sender_invoice_no: `BH-${Date.now()}`,
        invoice_receiver_code: profileId || "guest",
        invoice_description: `BalanceHub ${plan} subscription`,
        amount: amount,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/qpay/callback?plan=${plan}&profileId=${profileId || "guest"}`,
      }),
    });

    const invoice = await invoiceRes.json();

    return Response.json({
      success: true,
      invoice_id: invoice.invoice_id,
      qr_text: invoice.qr_text,
      qr_image: invoice.qr_image,
      urls: invoice.urls,
      amount,
    });
  } catch (error) {
    console.error("QPay error:", error);
    return Response.json(
      { success: false, error: "QPay invoice үүсгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
