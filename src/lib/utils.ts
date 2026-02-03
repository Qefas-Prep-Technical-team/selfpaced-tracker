import { ContentBlock } from "@/app/dashboard/campaigns/newsletter/ContentBlocks";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const safeParseColumns = (content: string) => {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
    // If it's a number (like "2"), return an array of that length
    if (!isNaN(Number(content))) return Array(Number(content)).fill("");
  } catch (e) {
    // If it's plain text or malformed, return a default 2-col array
    return ["", ""];
  }
  return ["", ""];
};

// Helper to convert blocks to a single HTML string for Resend
export const generateHtmlFromBlocks = (blocks: ContentBlock[]) => {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h1 style="font-family: sans-serif; color: #333;">${block.content}</h1>`;
        case "text":
          return `<p style="font-family: sans-serif; line-height: 1.6; color: #666;">${block.content}</p>`;
        case "image":
          return `<img src="${block.content}" style="max-width: 100%; height: auto; border-radius: 8px;" />`;
        case "columns":
          try {
            const cols = JSON.parse(block.content);
            return `
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                ${cols.map((c: string) => `<td style="padding: 10px; font-family: sans-serif; vertical-align: top;">${c}</td>`).join("")}
                            </tr>
                        </table>
                    `;
          } catch {
            return "";
          }
        default:
          return block.content;
      }
    })
    .join("");
};

// export const generateFinalHtml = (
//   blocks: any[],
//   subject: string,
//   senderEmail: string,
// ) => {
//   const renderBlockAsHtml = (block: any) => {
//     const getContent = (field: string, fallback: string) => {
//       if (typeof block.content === "string") return block.content;
//       if (typeof block.content === "object" && block.content !== null) {
//         return block.content[field] || fallback;
//       }
//       return fallback;
//     };

//     switch (block.type) {
//       case "text":
//         return `
//                     <div style="margin-bottom: 24px; font-family: sans-serif;">
//                         <h3 style="font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 12px;">
//                             ${typeof block.content === "object" ? block.content.title : "Update:"}
//                         </h3>
//                         <p style="font-size: 14px; line-height: 1.6; color: #475569; white-space: pre-wrap;">
//                             ${getContent("body", "")}
//                         </p>
//                     </div>`;
//       case "image":
//         const src =
//           typeof block.content === "string" && block.content.startsWith("http")
//             ? block.content
//             : "https://placehold.co/600x400?text=Analytics+Update";
//         return `<img src="${src}" style="width: 100%; border-radius: 8px; margin-bottom: 32px; display: block;" />`;
//       case "button":
//         return `
//                     <div style="text-align: center; margin-bottom: 32px;">
//                         <a href="#" style="background-color: #0070f3; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
//                             ${getContent("label", "Click Here")}
//                         </a>
//                     </div>`;
//       case "divider":
//         return `<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />`;
//       default:
//         return "";
//     }
//   };

//   // Standard Email Wrapper
//   return `
//     <!DOCTYPE html>
//     <html>
//         <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: sans-serif;">
//             <table width="100%" border="0" cellspacing="0" cellpadding="0">
//                 <tr>
//                     <td align="center" style="padding: 40px 20px;">
//                         <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; padding: 40px;">
//                             <tr>
//                                 <td align="center" style="padding-bottom: 40px;">
//                                    <img src="https://res.cloudinary.com/dhm9perrr/image/upload/e_background_removal,f_png/v1770035513/035203dd-0132-42a6-b863-c50ad270f6a3-removebg-preview_gmxzah.png" style="max-width: 100%; height: auto;" />
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>${blocks.map(renderBlockAsHtml).join("")}</td>
//                             </tr>
//                             <tr>
//                                 <td style="border-top: 1px solid #f1f5f9; padding-top: 30px; text-align: center;">
//                                     <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">QEFAS Prep School</p>
//                                     <p style="font-size: 10px; color: #94a3b8;">Lagos, Nigeria • <a href="#" style="color: #0070f3;">Unsubscribe</a></p>
//                                 </td>
//                             </tr>
//                         </table>
//                     </td>
//                 </tr>
//             </table>
//         </body>
//     </html>`;
// };

export const generateFinalHtml = (blocks: any[]) => {
  const renderBlockAsHtml = (block: any) => {
    // Helper to extract content safely
    const getContent = (field: string, fallback: string) => {
      if (typeof block.content === "string") return block.content;
      if (typeof block.content === "object" && block.content !== null) {
        return block.content[field] || fallback;
      }
      return fallback;
    };

    switch (block.type) {
      case "text":
        return `
          <div style="margin-bottom: 30px; text-align: center;">
            <h3 style="color: #1e293b; font-size: 18px; font-weight: bold; margin: 0 0 12px 0; font-family: sans-serif;">
              ${typeof block.content === "object" ? block.content.title : "Update:"}
            </h3>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0; font-family: sans-serif; white-space: pre-wrap;">
              ${getContent("body", "Your content here...")}
            </p>
          </div>`;

      case "image":
        const imageUrl =
          typeof block.content === "string" && block.content.startsWith("http")
            ? block.content
            : "https://placehold.co/600x400?text=Image+Block";
        return `
          <div style="margin-bottom: 32px;">
            <img src="${imageUrl}" alt="Email Image" style="width: 100%; max-width: 100%; border-radius: 8px; border: 1px solid #e2e8f0; display: block;" />
          </div>`;

      case "button":
        // This parses the JSON string. If it's not JSON, it falls back to the old string.
        const btn = (() => {
          try {
            return JSON.parse(block.content);
          } catch (e) {
            return { label: block.content, url: "#" };
          }
        })();

        return `
    <div style="text-align: center; margin-bottom: 30px;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <a href="${btn.url}" target="_blank" style="background-color: #0070f3; color: #ffffff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; font-family: sans-serif;">
              ${btn.label}
            </a>
          </td>
        </tr>
      </table>
    </div>`;

      case "video":
        // Extract Video ID to get the thumbnail
        const videoId = block.content.includes("v=")
          ? block.content.split("v=")[1].split("&")[0]
          : block.content.split("/").pop()?.split("?")[0];

        const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        return `
    <div style="margin-bottom: 25px; text-align: center;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center">
            <a href="${block.content}" target="_blank" style="text-decoration: none; display: inline-block;">
              <div style="position: relative; width: 320px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; line-height: 0;">
                <img src="${thumbnail}" alt="Watch Video" style="width: 320px; height: auto; display: block;" />
                
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 35px; background-color: #FF0000; border-radius: 8px; text-align: center;">
                  <span style="color: #ffffff; font-size: 18px; line-height: 35px; margin-left: 3px;">▶</span>
                </div>
              </div>
              <p style="margin-top: 8px; font-size: 12px; color: #64748b; font-family: sans-serif; font-weight: bold;">
                Click to watch on YouTube
              </p>
            </a>
          </td>
        </tr>
      </table>
    </div>`;

      case "divider":
        return `<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />`;

      case "columns":
        const columnData = safeParseColumns(block.content);
        const colWidth = Math.floor(100 / columnData.length);
        return `
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
            <tr>
              ${columnData
                .map(
                  (text: string, i: number) => `
                <td width="${colWidth}%" valign="top" style="padding: 10px;">
                  <div style="padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; background-color: #f8fafc; min-height: 100px;">
                    <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5; font-family: sans-serif; white-space: pre-wrap;">
                      ${text || `Column ${i + 1} content...`}
                    </p>
                  </div>
                </td>
              `,
                )
                .join("")}
            </tr>
          </table>`;

      default:
        return "";
    }
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td align="center" style="padding: 40px 40px 20px 40px;">
                    <img src="https://res.cloudinary.com/dhm9perrr/image/upload/e_background_removal,f_png/v1770035513/035203dd-0132-42a6-b863-c50ad270f6a3-removebg-preview_gmxzah.png" alt="Logo" style="width: 140px; height: auto; display: block;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 40px;">
                    ${blocks.map(renderBlockAsHtml).join("")}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px 40px 40px 40px; border-top: 1px solid #f1f5f9; text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold;">QEFAS Prep School</p>
                    <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.4;">
                      Lagos, Nigeria • You are receiving this because you subscribed to our updates.<br />
                      <a href="#" style="color: #0070f3; text-decoration: underline;">Unsubscribe</a> • <a href="#" style="color: #0070f3; text-decoration: underline;">Privacy Policy</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;
};
