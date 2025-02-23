const logger = require("../../../logger");
const z = require("zod");
const { deleteAsset } = require("../../../model/asset");
const { createSuccessResponse } = require("../../../response");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Delete an asset by its id after verifying ownership
 */

module.exports = async (req, res, next) => {
  logger.debug(
    { user: req.user, id: req.params.id },
    `received request: DELETE /v1/assets/:assetId`,
  );

  const assetId = await req.params.assetId;

  try {
    z.string().uuid().parse(assetId);
  } catch (error) {
    logger.debug({ error }, "invalid asset ID format");
    return next({ status: 400, message: "invalid asset id" });
  }

  let asset;
  try {
    asset = await prisma.asset.findUnique({
      where: { uuid: assetId },
      include: {
        character: true,
        user: true,
      },
    });
  } catch (error) {
    logger.error(error, "Error fetching asset");
    return next({ status: 500, message: "Internal server error" });
  }

  if (!asset) {
    logger.debug("asset not found");
    return next({ status: 404, message: "Asset not found" });
  }

  if (asset.user.hashedEmail !== req.user) {
    return next({
      status: 403,
      message: "Forbidden",
    });
  }

  try {
    await deleteAsset(asset.uuid);
    logger.debug(asset.uuid, "Asset deleted");
    return res
      .status(200)
      .json(createSuccessResponse({ message: "Asset deleted successfully" }));
  } catch (error) {
    logger.error(error, "Error deleting asset");
    return next({ status: 500, message: "Internal server error" });
  }
};
