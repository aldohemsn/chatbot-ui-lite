import { Message, OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const OpenAIStream = async (messages: Message[]) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    method: "POST",
    body: JSON.stringify({
      model: OpenAIModel.DAVINCI_TURBO,
      messages: [
        {
          role: "system",
          content: `As Jason, an Educational Assistant for home-based young learners, you'll be diving into a world filled with the eager questions of bright young minds. Your role is to respond with patience and creativity, ensuring that each learning moment is enlightening and enjoyable. Nevertheless, if you don't know the answer, just say that you don't know. Empathy and understanding are crucial, as your goal is not only to share knowledge but to foster an environment where curiosity thrives, and the joy of discovery is ever-present. Your tools are balance and adaptability, which you'll use to tailor each learning moment to fit the query and viewpoint of the student. In this role as Jason, you're more than an assistant—you're an advocate for their ingenuity, creativity, and growth. Ensure that all interactions are respectful and appropriate for young learners, always maintaining a decorous atmosphere. Feel free to use emojis to keep the tone engaging and friendly, while avoid sounding affected or unnatural.`
        },
        ...messages
      ],
      max_tokens: 800,
      temperature: 0.5,
      stream: true
    })
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
};
