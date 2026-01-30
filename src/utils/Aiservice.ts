import { Flashcard, GenerationOptions, FlashcardType } from "../types";

declare global {
  interface Window {
    puter: any;
  }
}

export const generateFlashcardsWithAI = async (
  notes: string,
  options: GenerationOptions
): Promise<Flashcard[]> => {
  try {
    // Initialize Puter if not already done
    if (!window.puter) {
      throw new Error("Puter.js is not loaded");
    }

    // Prepare the prompt for AI
    const prompt = buildPrompt(notes, options);

    // Use Puter.js AI capabilities
    const response = await window.puter.ai.chat({
      messages: [
        {
          role: "system",
          content: `You are an expert educational content creator specializing in creating high-quality flashcards. 
          Your task is to analyze the provided notes and generate flashcards that help students understand and retain information effectively.
          
          Guidelines:
          - Extract key concepts, definitions, and important information
          - Create clear, concise questions and answers
          - Use proper formatting with HTML tags for emphasis (<strong>, <em>, <mark>)
          - For topics and titles, use <strong> tags
          - For important concepts, use <mark> tags
          - Ensure questions are specific and answers are comprehensive
          - Include context and explanations where helpful
          - Return ONLY valid JSON in the specified format, no additional text`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "claude-sonnet-4-20250514", // Using Claude Sonnet 4 via Puter
    });

    // Parse the AI response
    const flashcards = parseAIResponse(response.message.content);
    return flashcards;
  } catch (error) {
    console.error("Error generating flashcards with AI:", error);
    // Fallback to basic parsing if AI fails
    return fallbackGeneration(notes, options);
  }
};

const buildPrompt = (notes: string, options: GenerationOptions): string => {
  const cardTypes: string[] = [];
  if (options.includeBasic) cardTypes.push("basic concept cards");
  if (options.includeApplication) cardTypes.push("application-based cards");
  if (options.includeQuiz) cardTypes.push("quiz-style cards");
  if (options.includeMCQ) cardTypes.push("multiple choice questions");
  if (options.includeFillBlank) cardTypes.push("fill-in-the-blank cards");

  return `Analyze the following notes and generate ${
    options.numberOfCards
  } flashcards.

Card types to include: ${cardTypes.join(", ")}
Difficulty level: ${options.difficulty}

Notes:
${notes}

Return a JSON array with the following structure:
[
  {
    "id": "unique-id",
    "type": "basic|application|quiz|mcq|fill-blank",
    "front": "Question or prompt (use <strong> for topics/titles, <mark> for key concepts)",
    "back": "Answer or explanation (formatted with HTML tags)",
    "topic": "Main topic (optional)",
    "difficulty": "easy|medium|hard",
    "options": ["option1", "option2", "option3", "option4"], // Only for MCQ
    "correctAnswer": "correct option", // For MCQ and fill-blank
    "explanation": "Why this is correct (optional)"
  }
]

Important formatting rules:
- Use <strong>text</strong> for all topics, titles, and headings
- Use <mark>important concept</mark> for key terms and concepts that need emphasis
- Use <em>text</em> for subtle emphasis
- Keep questions clear and concise
- Provide comprehensive answers with context
- For MCQ, include 4 options with one correct answer
- For fill-in-blank, use _____ in the front and provide the answer in correctAnswer field

Return ONLY the JSON array, no additional text or markdown.`;
};

const parseAIResponse = (response: string): Flashcard[] => {
  try {
    // Remove markdown code blocks if present
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(cleanResponse);

    if (Array.isArray(parsed)) {
      return parsed.map((card) => ({
        ...card,
        id: card.id || `ai-${Date.now()}-${Math.random()}`,
      }));
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw error;
  }
};

const fallbackGeneration = (
  notes: string,
  options: GenerationOptions
): Flashcard[] => {
  // Simple fallback: split notes into sentences and create basic cards
  const sentences = notes.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  const cards: Flashcard[] = [];
  const maxCards = Math.min(options.numberOfCards, sentences.length);

  for (let i = 0; i < maxCards; i++) {
    const sentence = sentences[i].trim();
    const words = sentence.split(" ");

    if (options.includeBasic && i % 3 === 0) {
      // Basic concept card
      const front = `What is meant by: <strong>${words
        .slice(0, 5)
        .join(" ")}...</strong>?`;
      const back = `<mark>${sentence}</mark>`;
      cards.push({
        id: `fallback-${i}`,
        type: "basic",
        front,
        back,
        difficulty:
          options.difficulty === "mixed" ? "medium" : options.difficulty,
      });
    } else if (options.includeApplication && i % 3 === 1) {
      // Application card
      cards.push({
        id: `fallback-${i}`,
        type: "application",
        front: `How would you apply: <strong>${sentence.substring(
          0,
          50
        )}...</strong>?`,
        back: `Application: ${sentence}`,
        difficulty:
          options.difficulty === "mixed" ? "medium" : options.difficulty,
      });
    } else if (options.includeQuiz && i % 3 === 2) {
      // Quiz card
      cards.push({
        id: `fallback-${i}`,
        type: "quiz",
        front: `<strong>Quiz:</strong> ${sentence.substring(
          0,
          sentence.length / 2
        )}...`,
        back: sentence,
        difficulty:
          options.difficulty === "mixed" ? "medium" : options.difficulty,
      });
    }
  }

  return cards;
};

// Function to check if Puter is available
export const isPuterAvailable = (): boolean => {
  return typeof window !== "undefined" && !!window.puter;
};

// Initialize Puter
export const initializePuter = async (): Promise<boolean> => {
  try {
    if (window.puter) {
      await window.puter.init();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to initialize Puter:", error);
    return false;
  }
};
