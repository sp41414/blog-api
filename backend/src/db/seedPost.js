require("dotenv").config();
const db = require("./prisma");

console.log("Creating posts...");
async function main() {
  try {
    await db.posts.create({
      data: {
        title: `The Evolution of Modern Interface Design`,
        text: `
        <h1><span style="color: #e03e2d;">This blog post is an <strong>ai generated placeholder!!!</strong></span></h1>
<h1>Design Paradigms of 2024</h1>
<p>Understanding the <strong>fundamental shifts</strong> in user interface paradigms is <em>crucial</em> for modern development. We are moving away from skepticism and towards utility.</p>
<p>&nbsp;</p>
<p>Key areas of focus include:</p>
<ol>
<li>Accessibility Standards</li>
<li>Performance Optimization</li>
<li>Dark Mode Integration</li>
</ol>
<ul>
<li>Client-side rendering</li>
<li>Server-side generation</li>
</ul>
<p><img src="https://placehold.co/174x163?text=UI+Chart" alt="Analytics Graph" width="174" height="163"></p>
<p>&nbsp;</p>
<h1>Statistical Analysis</h1>
<p>&nbsp;</p>
<p style="line-height: 2;">The data suggests a strong correlation between load times and retention.</p>
<p style="line-height: 2;">When the line height is increased, readability improves significantly for long-form content.</p>
<p style="line-height: 2;">Users engage 20% more with spaced typography.</p>
<p style="line-height: 2;"><span style="font-family: Georgia, serif;">(Figure 1.1: Serif fonts for contrast)</span></p>
<p style="line-height: 2;">&nbsp;</p>
<ul>
<li style="line-height: 2;">
<table style="border-collapse: collapse; width: 100%;" border="1"><colgroup><col style="width: 33.3%;"><col style="width: 33.3%;"><col style="width: 33.3%;"></colgroup>
<tbody>
<tr>
<td><strong>Metric</strong></td>
<td><strong>2023</strong></td>
<td><strong>2024</strong></td>
</tr>
<tr>
<td>Speed</td>
<td>1.2s</td>
<td>0.8s</td>
</tr>
</tbody>
</table>
</li>
</ul>
        `,
        author: process.env.ADMIN_USERNAME,
        usersId: 1,
      },
    });
  } catch (err) {
    console.error(err.stack);
    console.log("Disconnecting");
    await db.$disconnect();
    console.log("Done");
    process.exit(1);
  } finally {
    console.log("Disconnecting");
    await db.$disconnect();
    console.log("Done");
    process.exit(0);
  }
}
