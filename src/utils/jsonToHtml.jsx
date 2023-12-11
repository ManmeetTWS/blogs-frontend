function escapeHtml(html) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(html));
  return div.innerHTML;
}

// function converJsonToHtml(editorJSData) {
//   let html = "";

//   editorJSData.blocks.forEach((block) => {
//     switch (block.type) {
//       case "header":
//         if (block.data.level === 1) {
//           html += `<h1 style="font-size:2.5rem;">${block.data.text}</h1>`;
//         } else if (block.data.level === 2) {
//           html += `<h2 style="font-size:2rem;">${block.data.text}</h2>`;
//         } else if (block.data.level === 3) {
//           html += `<h3 style="font-size:1.5rem;">${block.data.text}</h3>`;
//         } else if (block.data.level === 4) {
//           html += `<h4 style="font-size:1.25rem;">${block.data.text}</h4>`;
//         } else if (block.data.level === 5) {
//           html += `<h5 style="font-size:1rem;">${block.data.text}</h5>`;
//         } else if (block.data.level === 6) {
//           html += `<h6 style=">${block.data.text}</h6>`;
//         }
//         break;
//       case "paragraph":
//         html += `<p style="font-size:21px; line-height:1.5; text-align:justify; margin:20px 0">${block.data.text}</p>`;
//         break;
//       case "image":
//         html += `<figure style="margin:20px 0"><img src="${block.data.url}" alt="${block.data.caption}" style="height:100%; width:100%;" /><figcaption style="text-align:center;">${block.data.caption}<figcaption /><figure />`;
//         break;
//       case "quote":
//         html += `<div style="margin:40px 0"><blockquote class="quote">${block.data.text}</blockquote><cite class="quote-caption">${block.data.caption}</cite></div>`;
//         break;
//       case "code":
//         html += `<div style="margin:20px 0; padding:20px; background-color:#ddd; max-height:400px; overflow:auto; text-align:left"><pre><code class="code-block">${escapeHtml(block.data.code)}</code></pre></div>`;
//         break;
//       case "list":
//         if (block.data.style === "ordered") {
//           html += `<ol style="margin:20px 0; font-size:21px; text-align:left">`;
//         } else {
//           html += `<ul style="margin:20px 0; font-size:21px;">`;
//         }
//         block.data.items.forEach((item) => {
//           html += `<li style="margin:10px 0">${item}</li>`;
//         });
//         if (block.data.style === "ordered") {
//           html += "</ol>";
//         } else {
//           html += "</ul>";
//         }
//         break;
//       case "delimiter":
//         html += `<hr style="margin:20px 0" />`;
//         break;
      
      
//     }
//   });

//   return html;
// }


function convertJsonToHtml(editorJSData) {
  let html = '';

  editorJSData.blocks.forEach((block) => {
    html += `<div class="block" data-id="${block.id}" data-type="${block.type}">`;

    switch (block.type) {
      case 'header':
        const headerTag = `h${block.data.level}`;
        const fontSize = (block.data.level === 1 ? 2.5 : (2.5 - block.data.level * 0.3)) + 'rem';
        html += `<${headerTag} style="font-size: ${fontSize}">${block.data.text}</${headerTag}>`;
        break;

      case 'paragraph':
        html += `<p style="font-size:21px; line-height:1.5; text-align:justify; margin:20px 0">${block.data.text}</p>`;
        break;
      case 'image':
        html += `<figure style="margin:20px 0"><img src="${block.data.url}" alt="${block.data.caption}" style="height:100%; width:100%;" /><figcaption style="text-align:center;">${block.data.caption}<figcaption /><figure />`;
        break;
      case 'quote':
        html += `<div style="margin:40px 0"><blockquote class="quote">${block.data.text}</blockquote><cite class="quote-caption">${block.data.caption}</cite></div>`;
        break;
      case 'code':
        html += `<div style="margin:20px 0; padding:20px; background-color:#ddd; max-height:400px; overflow:auto; text-align:left"><pre><code class="code-block">${escapeHtml(block.data.code)}</code></pre></div>`;
        break;
      case 'list':
        const listTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        html += `<${listTag} style="margin:20px 0; font-size:21px; text-align:left">`;
        block.data.items.forEach((item) => {
          html += `<li style="margin:10px 0">${item}</li>`;
        });
        html += `</${listTag}>`;
        break;
      case 'delimiter':
        html += '<hr style="margin:20px 0" />';
        break;
      default:
        break;
    }

    html += '</div>';
  });

  return html;
}


export {convertJsonToHtml}

