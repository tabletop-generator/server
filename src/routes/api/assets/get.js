const logger = require("../../../logger");
const prisma = require("../../../model/data/prismaClient");
const {
  createSuccessResponse,
  createErrorResponse,
} = require("../../../response");

/**
 * Get a list of assets filtered by the query
 * Query parameters:
 * - name: string
 * - type: asset_type (character, quest, map, location)
 * - userId: number
 * - visibility: visibility_type (public, private, unlisted)
 * - expand: boolean
 */

module.exports = async (req, res, next) => {
  try {
    logger.debug(
      { user: req.user, query: req.query },
      `received request: GET /v1/assets`,
    );

    const { name, type, userId, visibility, expand } = req.query;

    // Build where clause based on query parameters
    const where = {};

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (type) {
      where.type = type.toLowerCase();
    }

    if (userId) {
      where.creatorId = parseInt(userId);
      if (isNaN(where.creatorId)) {
        return res
          .status(400)
          .json(createErrorResponse(400, "Invalid user ID format"));
      }
    }

    if (visibility) {
      where.visibility = visibility.toLowerCase();
    }

    // If not querying for a specific user, only show public assets
    // Unless the request is from the asset owner
    if (!userId) {
      where.OR = [
        { visibility: "public" },
        {
          creatorId: req.user?.id,
          visibility: { in: ["private", "unlisted"] },
        },
      ];
    }

    // Get assets from database
    const assets = await prisma.asset.findMany({
      where,
      include: {
        character: true,
        user: true,
        comments: true,
        collections: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // If no assets found, return empty array
    if (!assets.length) {
      return res.status(200).json(
        createSuccessResponse({
          assets: [],
        }),
      );
    }

    // If expand is not true, return just the IDs
    if (expand !== "true") {
      return res.status(200).json(
        createSuccessResponse({
          assets: assets.map((asset) => asset.id),
        }),
      );
    }

    // Return expanded asset objects
    return res.status(200).json(
      createSuccessResponse({
        assets: assets.map((asset) => ({
          id: asset.id,
          uuid: asset.uuid,
          creatorId: asset.creatorId,
          created: asset.createdAt,
          updated: asset.updatedAt,
          isFeatured: asset.isFeatured,
          likes: asset.likes,
          type: asset.type,
          visibility: asset.visibility,
          name: asset.name,
          description: asset.description,
          imageUrl: asset.imageUrl,
          imageUrlExpiry: asset.imageUrlExpiry,
          character: asset.type === "character" ? asset.character : undefined,
        })),
      }),
    );
  } catch (err) {
    logger.error({ err }, "Error getting assets");
    next(err);
  }
};
