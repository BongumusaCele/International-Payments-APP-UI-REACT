export const readErrorMessage = async (response: Response) => {
  const fallbackMessage = `Request failed with status ${response.status}`;

  try {
    const responseText = await response.text();

    if (!responseText) {
      return fallbackMessage;
    }

    let body: unknown;

    try {
      body = JSON.parse(responseText);
    } catch {
      return responseText;
    }

    if (!body || typeof body !== 'object') {
      return fallbackMessage;
    }

    const bodyRecord = body as Record<string, unknown>;
    const validationValues = bodyRecord.errors && typeof bodyRecord.errors === 'object'
      ? Object.values(bodyRecord.errors)
      : Object.values(bodyRecord);
    const modelStateMessages = validationValues
      .flatMap((value) => Array.isArray(value) ? value : [])
      .filter((value): value is string => typeof value === 'string');

    if (modelStateMessages.length > 0) return modelStateMessages.join(' ');
    if (typeof bodyRecord.message === 'string') return bodyRecord.message;
    if (typeof bodyRecord.title === 'string') return bodyRecord.title;
  } catch {
    // Fall through to the generic HTTP message below.
  }

  return fallbackMessage;
};
