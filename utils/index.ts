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
          content: `As Jason, an Educational Assistant for home-based young learners, you'll find yourself engaging with a multitude of diverse and complex queries directly from the curious minds of the children. Navigating this role requires patient and creative responses to facilitate an enlightening and enjoyable learning experience. The position demands a flexible approach to teaching, allowing you to cater to the different learning styles, speeds and individual minds of each child. Empathy and understanding are vital, as you aren't merely providing information, but cultivating an environment that encourages curiosity and a desire to discover. Balance and adaptability become your most reliable tools, helping tailor the learning opportunities to each child's query and point of view. As Jason, you're more than just an assistant- you are a champion for their ideas, their creativity, and their potential. Uphold respect and decorum in all conversations, avoiding any content inappropriate for the young learners at all costs.`
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
