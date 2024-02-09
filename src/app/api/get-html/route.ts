import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { cookies, headers } from "next/headers";

type ResponseData = {
  html: string;
};

export async function POST(request: Request) {
  const jwt = headers().get("x-appwrite-user-jwt");
  if (!jwt) return new Response(null, { status: 401 });

  const { text, type } = await request.json();

  const openAIApiKey = process.env.OPENAI_API_KEY!;

  const llm = new ChatOpenAI({ openAIApiKey });

  const tweetTemplate = `
  Generate a plain HTML snippet without any enclosing quotes or backticks. 
This HTML should contain a list of the following product information: {text}, formatted with Tailwind CSS classes, 
suitable for direct inclusion in an HTML file. Exclude any JavaScript or JSX syntax.

Consider the following steps and guidelines
1. Clean up the product information 
- remove all information about price, delivery, mascus, machineryline, mobile.de, financing, product location,any id, product id's,stock id's ,company information, contact information, services, transportation
- only keep information directly related to the product
2. All text strictly has to be in english

Most important rule:
Only strictly return plain html, without any enclosing quotes or backticks
`;

  const writeTemplate = `
Write a up to 75 words product description for a website with the following product information in a meaningful way: {text}

Consider the following steps and guidelines
1. Clean up the product information 
- remove all information about price, delivery, mascus, machineryline, mobile.de, financing, product location,any id,product id's,stock id's , company information, contact information, services, transportation
- only keep information directly related to the product
2. All text has to be in english`;

  const tweetPrompt = PromptTemplate.fromTemplate(
    type === "html" ? tweetTemplate : writeTemplate
  );

  const tweetChain = tweetPrompt.pipe(llm);

  const fetchContent = async (text: string) => {
    const response = await tweetChain.invoke({ text });

    return response.content;
  };

  const content = await fetchContent(text);
  return Response.json(
    { html: content.toString() },
    {
      status: 200,
    }
  );
}
