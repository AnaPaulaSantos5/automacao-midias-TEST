export async function POST() {
  return Response.json({
    hasKey: !!process.env.OPENAI_API_KEY,
    keyLength: process.env.OPENAI_API_KEY?.length || 0
  });
}