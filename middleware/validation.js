const isValidUrl = (string) => {
  try {
    let url = string.trim();

    if (url.startsWith("www.")) {
      url = "https://" + url;
    }

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://") &&
      url.includes(".")
    ) {
      url = "https://" + url;
    }

    const urlObj = new URL(url);

    const hostname = urlObj.hostname;
    if (!hostname.includes(".")) {
      return false;
    }

    const parts = hostname.split(".");
    const tld = parts[parts.length - 1];
    if (tld.length < 2) {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
};

const validateUrl = (req, res, next) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({
      success: false,
      message: "URL is required",
    });
  }

  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({
      success: false,
      message:
        "Please enter a valid URL (e.g., example.com, www.example.com, https://example.com)",
    });
  }

  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "URL code already exists",
    });
  }

  res.status(500).json({
    success: false,
    message: "Server error",
  });
};

module.exports = {
  validateUrl,
  errorHandler,
  isValidUrl,
};
