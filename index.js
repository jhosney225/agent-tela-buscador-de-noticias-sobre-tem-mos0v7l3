
```javascript
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function searchNews(topic) {
  console.log(`\n🔍 Buscando noticias sobre: "${topic}"\n`);
  console.log("📰 Noticias encontradas:\n");
  console.log("─".repeat(60));

  const systemPrompt = `You are a news search assistant. When asked about a topic, you provide a list of relevant news articles with:
1. Title
2. Source
3. Brief summary (2-3 sentences)
4. Relevance score (1-10)
5. Date (approximate)

Format each news item clearly with numbers and use markdown for better readability.
Provide at least 5 news items per search.
Be specific and realistic with news sources.`;

  const userMessage = `Find and list recent news articles about: ${topic}. 
Include diverse perspectives and sources.
Format each news item with title, source, summary, relevance score, and approximate date.`;

  try {
    const stream = await client.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        process.stdout.write(chunk.delta.text);
      }
    }

    console.log("\n" + "─".repeat(60));
    return true;
  } catch (error) {
    console.error("Error searching for news:", error.message);
    return false;
  }
}

async function getNewsSummary(topics) {
  console.log("\n📊 Generando resumen de noticias por tema:\n");

  const systemPrompt = `You are a news analyst. Create a comprehensive summary of news trends across multiple topics.
For each topic provided, give:
1. Key trends
2. Most important stories
3. Overall sentiment (positive/negative/neutral)
4. What to watch for

Be concise but informative. Use bullet points for clarity.`;

  const userMessage = `Create a news summary for these topics: ${topics.join(", ")}. 
Highlight the most important stories and trends for each topic.`;

  try {
    const stream = await client.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        process.stdout.write(chunk.delta.text);
      }
    }

    console.log("\n");
    return true;
  } catch (error) {
    console.error("Error generating summary:", error.message);
    return false;
  }
}

async function compareNews(topic1, topic2) {
  console.log(
    `\n⚖️  Comparando noticias sobre: "${topic1}" vs "${topic2}"\n`
  );

  const systemPrompt = `You are a news analyst. Compare news coverage and stories between two topics.
Provide:
1. Volume of coverage for each topic
2. Key differences in the stories
3. Similarities
4. Which topic is trending more
5. Interesting contrasts

Use a clear comparison format.`;

  const userMessage = `Compare recent news and coverage about "${topic1}" and "${topic2}".
What are the main differences and similarities in their coverage?`;

  try {
    const stream = await client.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        process.stdout.write(chunk.delta.text);
      }
    }

    console.log("\n");
    return true;
  } catch (error) {
    console.error("Error comparing news:", error.message);
    return false;
  }
}

async function analyzeNewsTrends(topic) {
  console.log(`\n📈 Analizando tendencias de noticias sobre: "${topic}"\n`);

  const systemPrompt = `You are a news trend analyst. Analyze news trends for a given topic.
Provide:
1. Current trend (upward/downward/stable)
2. Key drivers of the trend
3. Sentiment analysis of coverage
4. Predictions for the next week
5. Related topics trending together

Be specific and data-driven in your analysis.`;

  const userMessage = `Analyze the news trends for: ${topic}.
What patterns do you see in recent coverage? How is sentiment changing?`;

  try {
    const stream = await client.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    for await (const chunk of stream) {
      if (
        