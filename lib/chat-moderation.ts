const DIGIT_CONTACT_PATTERN = /(?:\+?\d[\d\s().\-_/\\|]{6,}\d)/g;
const NUMBER_WORD_PATTERN =
  /\b(?:zero|um|uma|dois|duas|tres|três|quatro|cinco|seis|sete|oito|nove)\b/gi;
const NUMBER_WORD_SEQUENCE_PATTERN =
  /(?:\b(?:zero|um|uma|dois|duas|tres|três|quatro|cinco|seis|sete|oito|nove)\b(?:[\s().,\-_/\\|:]*)?){8,}/gi;

function maskNumericContactCandidate(candidate: string) {
  const digits = candidate.match(/\d/g)?.length ?? 0;
  if (digits < 8) {
    return candidate;
  }

  return candidate.replace(/\d/g, "*");
}

function maskWrittenNumberSequence(candidate: string) {
  return candidate.replace(NUMBER_WORD_PATTERN, "***");
}

export function moderateOutgoingChatMessage(body: string) {
  let sanitized = body;

  sanitized = sanitized.replace(DIGIT_CONTACT_PATTERN, maskNumericContactCandidate);
  sanitized = sanitized.replace(NUMBER_WORD_SEQUENCE_PATTERN, maskWrittenNumberSequence);

  return {
    sanitizedBody: sanitized,
    wasRedacted: sanitized !== body,
  };
}
