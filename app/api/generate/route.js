export async function POST(request) {
  const { profile, serviceType } = await request.json();

  const gm = { male: "эрэгтэй", female: "эмэгтэй" };
  const gol = { lose: "жин хасах", gain: "булчин нэмэх", maintain: "жин хадгалах", comp: "бодибилдинг тэмцээний бэлтгэл", health: "эрүүл мэнд" };
  const act = { sedentary: "суудлын", light: "бага идэвхтэй", moderate: "дунд", active: "маш идэвхтэй" };
  const rest = Array.isArray(profile.restrictions) ? profile.restrictions.filter(r => r !== "none").join(", ") || "байхгүй" : "байхгүй";
  const expMap = { beginner: "шинэхэн", intermediate: "дунд", advanced: "туршлагатай" };
  const eqMap = { gym: "бүрэн gym", home: "гэрийн тоног", none: "тоноггүй" };

  const baseInfo = `Хүйс: ${gm[profile.gender]}, Нас: ${profile.age}, Жин: ${profile.weight}кг, Зорилтот жин: ${profile.targetWeight}кг, Өндөр: ${profile.height}см, Зорилго: ${gol[profile.goal]}, Идэвх: ${act[profile.activity]}, Нойр: ${profile.sleep || "-"}, Ус: ${profile.water || "-"}`;

  let prompt = "";

  if (serviceType === "meal") {
    prompt = `Монгол хүний хоолны соёлд тохирсон 3 хоногийн хоолны төлөвлөгөө гарга.

${baseInfo}
Хоол бэлдэх цаг: ${profile.cookTime || "30"} мин, Төсөв: ${profile.budget || "mid"}, Өдрийн хоол: ${profile.meals_per_day || "4"} удаа, Хязгаарлалт: ${rest}

ЗӨВХӨН JSON. Markdown бичихгүй. Зөвхөн цэвэр JSON:
{"days":[{"dayLabel":"1-р өдөр","meals":[{"time":"Өглөө (7:00)","name":"нэр","calories":400,"ingredients":["найрлага - хэмжээ"],"description":"бэлдэх заавар"}]}],"tips":["зөвлөгөө"]}
Өдөр бүр ${profile.meals_per_day || 4} хоол. Монгол хоол голчил.`;
  } else {
    const wTypes = Array.isArray(profile.workoutType) ? profile.workoutType.join(", ") : "weights, cardio";
    prompt = `${profile.workoutDays || 4} хоногийн дасгалын төлөвлөгөө гарга.

${baseInfo}
Туршлага: ${expMap[profile.experience] || "дунд"}, Өдөр: ${profile.workoutDays || 4}, Дасгал: ${wTypes}, Тоног: ${eqMap[profile.equipment] || "gym"}, Гэмтэл: ${profile.injury || "none"}

ЗӨВХӨН JSON. Markdown бичихгүй:
{"days":[{"dayLabel":"1-р өдөр","type":"Цээж + Triceps","exercises":[{"name":"Bench Press","detail":"4×10, амрах 60с","note":""}]}],"tips":["зөвлөгөө"]}`;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = (data.content || []).map(c => c.text || "").join("").replace(/```json|```/g, "").trim();

    const plan = JSON.parse(text);
    return Response.json({ success: true, plan });
  } catch (error) {
    console.error("Generate error:", error);
    return Response.json({ success: false, error: "Generation failed" }, { status: 500 });
  }
}
