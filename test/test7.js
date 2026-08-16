const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: "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"
});

const run = async () => {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: "Write a haiku about recursion in programming."
            }
        ]
    });

    console.log(completion.choices[0].message);
};

run();
