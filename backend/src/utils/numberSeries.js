const NumberSeries = require('../models/NumberSeries');

/**
 * Generate the next number in a series atomically.
 * Uses findOneAndUpdate with $inc to prevent race conditions.
 */
const generateNumber = async ({ organisationId, module, academicYearId }) => {
  const filter = { organisationId, module };
  if (academicYearId) filter.academicYearId = academicYearId;

  const series = await NumberSeries.findOneAndUpdate(
    filter,
    { $inc: { currentSeq: 1 } },
    { new: true, upsert: false }
  );

  if (!series) {
    throw new Error(`Number series not configured for module: ${module}. Please set it up in Organisation Settings.`);
  }

  const seq = String(series.currentSeq).padStart(series.padding, '0');
  const separator = series.separator || '-';
  let number = `${series.prefix}${separator}${seq}`;
  if (series.suffix) number += `${separator}${series.suffix}`;
  return number;
};

/**
 * Peek the next number without incrementing (for preview).
 */
const peekNextNumber = async ({ organisationId, module, academicYearId }) => {
  const filter = { organisationId, module };
  if (academicYearId) filter.academicYearId = academicYearId;
  const series = await NumberSeries.findOne(filter);
  if (!series) return null;
  const seq = String(series.currentSeq + 1).padStart(series.padding, '0');
  const separator = series.separator || '-';
  let number = `${series.prefix}${separator}${seq}`;
  if (series.suffix) number += `${separator}${series.suffix}`;
  return number;
};

module.exports = { generateNumber, peekNextNumber };
