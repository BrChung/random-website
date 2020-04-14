# Cloudflare Workers Internship Application: Full-Stack Submission

## What is it?

Using Cloudflare Workers, this application will randomly send users to one of two webpages. This project utilizes Cloudflare Workers API and is deployed on a [domain](https://random.brianchung.co).

### What does it do?

1. Request the URLs from CloudFlare's API (https://cfw-takehome.developers.workers.dev/api/variants)
2. Requests a random variant and modifies the HTML with [HTMLRewriter](https://developers.cloudflare.com/workers/reference/apis/html-rewriter/), an API build into the Workers runtime.
3. Persists varaints when a user fetches the website. A cookie is set so that the user will get the same variant for the next 24 hours.

To check it out, the website is deployed on the free worker's [subdomain](https://fullstack-intern-challenge.random-website.workers.dev/) as well as on my [personal website](https://random.brianchung.co).

## Getting Started

### 1. Install the workers command-line tool wrangler.

The Workers Quick Start in the documentation shows how to get started with Wrangler, creating a project, and configuring and deploying it. We highly recommend that you spend time reading and following along with this guide!

To begin, install the [Wrangler](https://github.com/cloudflare/wrangler) command-line tool.

### 2. Generate a new project using `wrangler generate` command

Using the `generate` command (covered in the Quick Start), generate a new project with a name of your choice:

```sh
$ wrangler generate my-app https://github.com/BrChung/random-website
```

### 3. Use `wrangler dev` to locally test/develop your application

The recently launched [`wrangler dev`](https://github.com/cloudflare/wrangler#-dev) feature will allow you to begin developing your application using `localhost` - this means that you can test your project locally and make sure it works, without having to sort out deployment until later in the exercise.

Note that a major benefit of using `wrangler dev` is the ability to output `console.log` statements to your terminal - this is super useful for inspecting HTTP responses and variables!

## Try the Challenge Yourself!

### Generate a new project using `wrangler generate` command

Using the `generate` command, generate a new project with a name of your choice:

```sh
$ wrangler generate my-app https://github.com/cloudflare-internship-2020/internship-application-fullstack
```
