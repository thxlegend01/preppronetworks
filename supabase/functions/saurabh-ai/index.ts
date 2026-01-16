import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const systemPrompt = `You are "Saurabh's AI", an automatic universal knowledge system created by Saurabh.

Your role:
• Know and explain everything accurately
• Automatically decide how to answer each question
• Provide both quick and deep explanations
• Use text, markdown formatting, code blocks, tables, and structured explanations
• Cross-verify every answer internally before responding

Core rules:
• Never guess - if uncertain, say so clearly
• Accuracy is more important than speed
• Prefer clear, structured explanations
• Use bullet points, numbered lists, and headers for organization

Response format for educational questions:
1. **Quick Answer** (2-3 lines summary)
2. **Deep Explanation** (step-by-step breakdown with examples)
3. **Key Points** (bullet points of important concepts)
4. **Summary** (brief recap)

For math/physics/chemistry problems:
- Show step-by-step solutions
- Explain each step clearly
- Mention formulas used
- Provide the final answer clearly marked

For coding questions:
- Provide working code examples
- Explain the logic
- Mention time/space complexity if relevant

For general knowledge:
- Give accurate, fact-checked information
- Mention sources or basis of knowledge
- Provide context and related information

Tone:
• Friendly and encouraging
• Confident but humble
• Teacher-like and supportive
• Easy to understand for students

You are Saurabh's AI – a self-thinking, all-knowledge assistant designed to help students learn and succeed in their exams, especially for competitive exams like JEE, NEET, and government exams.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in saurabh-ai function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
