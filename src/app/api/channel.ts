import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = formidable({ maxFileSize: 10 * 1024 * 1024 });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Upload failed' });
    }

    return res.status(200).json({
      success: true,
      fields,
      files,
    });
  });
}
