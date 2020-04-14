/**
 * Brian Chung - Mon, April 13, 2020
 * Using Cloudflare workers, this application will randomly respond
 * with one of two variant webpages provided by Cloudflare's api/variant
 **/

// URL to Cloudflare API to recieve URLs to variants
const VARIANT_API = "https://cfw-takehome.developers.workers.dev/api/variants";

const COOKIE_NAME = "variant-id";

// Upon 'fetch' from user, worker will respond with method provided by handleRequest
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond with modified, randomly selected one of two variant webpages
 * @param {Request} request
 */
async function handleRequest(request) {
  variantURLs = await (await fetch(VARIANT_API)).json(); // Fetch Cloudflare api/variants JSON
  const cookie = parseInt(getCookie(request, COOKIE_NAME)); //Get cookie (variant-id)

  //* If cookie is valid (0, 1), rewrite variant *
  if (cookie === 0 || cookie === 1) {
    variantURL = variantURLs.variants[cookie]; // Get variant URL to be displayed given cookie
    response = await fetch(variantURL); // Fetch variant HTML Response
    return variantRewriter.transform(response); // Return modified variant using HTMLRewriter API
  }

  //* Else cookie has not been previously set or is invalid *

  // Math.random() generates a random float between 0 and 1, round to nearest int to get random index
  variantID = Math.round(Math.random());

  // Get Random Variant URL and fetch
  randVariantURL = variantURLs.variants[variantID];
  response = await fetch(randVariantURL);

  const transformedHTML = variantRewriter.transform(response);

  // Create cookie <variant-id> that will expire in 24 hours
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const cookieHeader = COOKIE_NAME.concat(
    "=",
    variantID,
    "; Expires=",
    tomorrow.toUTCString(),
    ";"
  );

  // Return modified variant using HTMLRewriter and set new cookie
  return new Response(await transformedHTML.text(), {
    headers: {
      "Set-Cookie": cookieHeader,
      "content-type": "text/html"
    }
  });
}

//Changes the Title of the Webpage
class TitleHandler {
  element(element) {
    const newTitle = `<title>Brian Chung's Submission</title>`;
    element.replace(newTitle, { html: true });
  }
}

//Changes the main title of the webpage in heading
class TitleHeadingHandler {
  element(element) {
    const newHeading = `<h1 class="text-lg leading-6 font-medium text-gray-900" id="title">Brian Chung</h1>`;
    element.replace(newHeading, { html: true });
  }
}

//Changes the description text
class DescriptionHandler {
  text(text) {
    const descriptionText = text.text;
    const newDescriptionText = descriptionText.replace(
      "the take home project!",
      "two. Please take some time to check out my website!"
    );
    text.replace(newDescriptionText);
  }
}

//Changes the href attribute to new URL as well as its text in Call-to-Action Button
class ButtonHandler {
  element(element) {
    const attribute = element.getAttribute("href");
    element.setAttribute(
      "href",
      attribute.replace("https://cloudflare.com", "https://brianchung.co")
    );
  }
  text(text) {
    const buttonText = text.text;
    const newButtonText = buttonText.replace(
      "Return to cloudflare.com",
      "Continue to brianchung.co"
    );
    text.replace(newButtonText);
  }
}

//Change SVG into profile image
class SVGHandler {
  element(element) {
    const newImage = `<img src="https://www.brianchung.co/core/uploads/2019/05/DSC00384.jpg" style="border-radius: 50%">`;
    element.replace(newImage, { html: true });
  }
}

//Create new HTML Rewriter to modify HTML contents (built into Workers runtime)
const variantRewriter = new HTMLRewriter()
  .on("title", new TitleHandler())
  .on("h1#title", new TitleHeadingHandler())
  .on("p#description", new DescriptionHandler())
  .on("a#url", new ButtonHandler())
  .on("svg", new SVGHandler());

/**
 * Grabs the cookie with name from the request headers
 * @param {Request} request incoming Request
 * @param {string} name of the cookie to grab
 * Source: https://developers.cloudflare.com/workers/templates/pages/cookie_extract/
 */
function getCookie(request, name) {
  let result = null;
  let cookieString = request.headers.get("Cookie");
  if (cookieString) {
    let cookies = cookieString.split(";");
    cookies.forEach(cookie => {
      let cookieName = cookie.split("=")[0].trim();
      if (cookieName === name) {
        let cookieVal = cookie.split("=")[1];
        result = cookieVal;
      }
    });
  }
  return result;
}
