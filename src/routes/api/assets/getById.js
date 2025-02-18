const logger = require("../../../logger");
const { z } = require("zod");
const { PrismaClientKnownRequestError } = require("@prisma/client").Prisma;
const asset = require("../../../model/asset");
const { createSuccessResponse } = require("../../../response");

/**
 * Get an asset by its id
 */
module.exports = async (req, res, next) => {
  try {
    logger.debug(
      { user: req.user, id: req.params.assetId },
      `received request: GET /v1/assets/:assetId`,
    );

    // Validate UUID format
    try {
      z.string().uuid().parse(req.params.assetId);
    } catch (error) {
      logger.debug({ error }, "invalid asset ID format");
      return next({ status: 400, message: "Invalid uuid" });
    }

    // Get asset using the model's get function
    let foundAsset;
    try {
      foundAsset = await asset.get(req.params.assetId);
    } catch (error) {
      logger.error({ error }, "Error fetching asset");

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return next({ status: 404, message: "Asset not found" });
      }
      return next({ status: 500, message: "Internal server error" });
    }

    // Check visibility permissions
    if (
      foundAsset.visibility !== "public" &&
      foundAsset.creatorId !== req.user?.id
    ) {
      return next({
        status: 403,
        message: "Not authorized to view this asset",
      });
    }

    // Return the asset
    return res.status(200).json(createSuccessResponse({ asset: foundAsset }));
  } catch (err) {
    logger.error({ err }, "Error getting asset by ID");
    return next({ status: 500, message: "Internal server error" });
  }
};
