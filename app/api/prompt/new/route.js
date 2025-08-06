import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { getAuthenticatedUser, createSecureResponse } from "@utils/auth";
import { validatePrompt, validateTag, createErrorResponse } from "@utils/validation";
import { applyRateLimit } from "@utils/rateLimit";

export const POST = async (request) => {
    try {
        // Apply rate limiting (max 5 prompts per minute per IP)
        const rateLimitResult = applyRateLimit(request, { limit: 5, window: 60000 });
        if (!rateLimitResult.success) {
            return createErrorResponse(
                `Rate limit exceeded. Try again after ${rateLimitResult.resetTime.toISOString()}`,
                429
            );
        }

        // Check authentication
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return createErrorResponse("Authentication required", 401);
        }

        // Parse and validate request body
        let body;
        try {
            body = await request.json();
        } catch (error) {
            return createErrorResponse("Invalid JSON format", 400);
        }

        const { userId, prompt, tag } = body;

        // Validate user ownership
        if (!userId || userId !== user.id) {
            return createErrorResponse("Unauthorized: Invalid user", 403);
        }

        // Validate prompt
        const promptValidation = validatePrompt(prompt);
        if (!promptValidation.isValid) {
            return createErrorResponse(`Prompt validation failed: ${promptValidation.errors.join(', ')}`, 400);
        }

        // Validate tag
        const tagValidation = validateTag(tag);
        if (!tagValidation.isValid) {
            return createErrorResponse(`Tag validation failed: ${tagValidation.errors.join(', ')}`, 400);
        }

        // Connect to database
        await connectToDB();

        // Create new prompt with sanitized data
        const newPrompt = new Prompt({ 
            creator: userId, 
            prompt: promptValidation.sanitized, 
            tag: tagValidation.sanitized 
        });

        await newPrompt.save();
        
        return createSecureResponse(newPrompt, 201);
    } catch (error) {
        console.error("Error creating prompt:", error);
        return createErrorResponse("Internal server error", 500);
    }
};