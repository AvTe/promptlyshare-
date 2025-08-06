import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { createSecureResponse } from "@utils/auth";
import { validateObjectId, createErrorResponse } from "@utils/validation";

export const GET = async (request, { params }) => {
    try {
        // Validate ID format
        const idValidation = validateObjectId(params.id);
        if (!idValidation.isValid) {
            return createErrorResponse(`Invalid user ID: ${idValidation.errors.join(', ')}`, 400);
        }

        await connectToDB();

        const prompts = await Prompt.find({ creator: params.id }).populate("creator");

        return createSecureResponse(prompts, 200);
    } catch (error) {
        console.error("Error fetching user prompts:", error);
        return createErrorResponse("Failed to fetch prompts created by user", 500);
    }
}; 