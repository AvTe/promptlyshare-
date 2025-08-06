import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { createSecureResponse } from "@utils/auth";

export const GET = async (request) => {
    try {
        await connectToDB();

        const prompts = await Prompt.find({}).populate('creator');

        return createSecureResponse(prompts, 200);
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return createSecureResponse("Failed to fetch all prompts", 500);
    }
}; 