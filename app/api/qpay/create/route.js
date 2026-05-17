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
  const { plan } = await request.json();

  // Үнийн тохиргоо
  const prices = {
    meal: { amount: 9900, desc: "Хоолны төлөвлөгөө (1 сар)" },
    workout: { amount: 9900, desc: "Дасгалын төлөвлөгөө (1 сар)" },
    both: { amount: 14900, desc: "Хоол + Дасгал хослол (1 сар)" },
  };

  const selected = prices[plan] || prices.both;

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
        invoice_receiver_code: "guest",
        invoice_description: `BalanceHub - ${selected.desc}`,
        amount: selected.amount,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/qpay/callback?plan=${plan}`,
      }),
    });

    const invoice = await invoiceRes.json();

    return Response.json({
      success: true,
      invoice_id: invoice.invoice_id,
      qr_text: invoice.qr_text,
      qr_image: invoice.qr_image,
      urls: invoice.urls,
      amount: selected.amount,
      plan: plan,
    });
  } catch (error) {
    console.error("QPay error:", error);
    return Response.json(
      { success: false, error: "QPay invoice үүсгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
