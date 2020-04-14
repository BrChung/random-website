/**
 * Brian Chung - Mon, April 13, 2020
 * Using Cloudflare workers, this application will randomly respond
 * with one of two varient webpages provided by CloudFlare's api/variant
 **/

// URL to CloudFlare API to recieve URLs to variants
const variantURLAPI =
  "https://cfw-takehome.developers.workers.dev/api/variants";

// Upon 'fetch' from user, worker will respond with method provided by handleRequest
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond with modified, randomly selected one of two variant webpages
 * @param {Request} request
 */
async function handleRequest(request) {
  //Fetch CloudFlare api/variants and parse JSON
  variantURLs = await (await fetch(variantURLAPI)).json();
  //Since Math.random() generates a random float between 0 and 1, round to nearest int to get random index
  variantNumber = Math.round(Math.random());
  randChosenVariantURL = variantURLs.variants[variantNumber];
  //Fetch variant HTML Response given random variant URL
  variantHTML = await fetch(randChosenVariantURL);
  //Return modified variant using HTMLRewriter
  return variantRewriter.transform(variantHTML);
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
      "Go to brianchung.co"
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
