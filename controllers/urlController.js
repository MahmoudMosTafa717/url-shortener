const shortid = require("shortid");
const Url = require("../models/Url");
const { isValidUrl } = require("../middleware/validation");

const normalizeUrl = (url) => {
  let normalizedUrl = url.trim();

  if (normalizedUrl.startsWith("www.")) {
    normalizedUrl = "https://" + normalizedUrl;
  }

  if (
    !normalizedUrl.startsWith("http://") &&
    !normalizedUrl.startsWith("https://") &&
    normalizedUrl.includes(".")
  ) {
    normalizedUrl = "https://" + normalizedUrl;
  }

  return normalizedUrl;
};

const getHomepage = async (req, res) => {
  try {
    const userUrls = req.session.urls || [];
    res.render("index", { urls: userUrls });
  } catch (error) {
    console.error(error);
    res.render("index", { urls: [] });
  }
};

const createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;

  try {
    const urlToShorten = normalizeUrl(originalUrl);

    let url = await Url.findOne({ originalUrl: urlToShorten });

    if (url) {
      if (!req.session.urls) {
        req.session.urls = [];
      }

      const existsInSession = req.session.urls.find(
        (u) => u.urlCode === url.urlCode
      );
      if (!existsInSession) {
        req.session.urls.unshift(url.toObject());
        if (req.session.urls.length > 10) {
          req.session.urls = req.session.urls.slice(0, 10);
        }
      }

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          success: true,
          data: {
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            urlCode: url.urlCode,
          },
        });
      }

      const userUrls = req.session.urls || [];
      return res.render("index", {
        urls: userUrls,
        shortenedUrl: url.shortUrl,
        originalUrl: url.originalUrl,
      });
    }

    const urlCode = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

    url = new Url({
      originalUrl: urlToShorten,
      shortUrl,
      urlCode,
    });

    await url.save();

    if (!req.session.urls) {
      req.session.urls = [];
    }
    req.session.urls.unshift(url.toObject());
    if (req.session.urls.length > 10) {
      req.session.urls = req.session.urls.slice(0, 10);
    }

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(201).json({
        success: true,
        data: {
          originalUrl: url.originalUrl,
          shortUrl: url.shortUrl,
          urlCode: url.urlCode,
        },
      });
    }

    const userUrls = req.session.urls || [];
    res.render("index", {
      urls: userUrls,
      shortenedUrl: shortUrl,
      originalUrl: urlToShorten,
    });
  } catch (error) {
    console.error(error);

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }

    const userUrls = req.session.urls || [];
    res.render("index", {
      urls: userUrls,
      error: "Server error. Please try again.",
    });
  }
};

const redirectToUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.render("redirect", {
        error: "URL not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.render("redirect", {
      error: "Server error",
    });
  }
};

const getAllUrls = async (req, res) => {
  try {
    const userUrls = req.session.urls || [];

    res.json({
      success: true,
      data: userUrls,
      totalUrls: userUrls.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getHomepage,
  createShortUrl,
  redirectToUrl,
  getAllUrls,
};
