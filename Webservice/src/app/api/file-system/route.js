import fs from 'fs';
import path from 'path';

export async function GET(request) {
    const {searchParams}  = new URL(request.url);
    const mode = searchParams.get('mode');
    const level_id = searchParams.get('level_id');
    const dir = path.join(process.cwd(), 'public', 'data', mode);

    try{
        const files = fs.readdirSync(dir);
        const targetFile = files.find(
            (file) => file.startsWith(`${level_id}-`) && file.endsWith(".json")
        );
        if (!targetFile) {
            return new Response(JSON.stringify({ error: "File not found"}), {status: 404});
        }
        return new Response(JSON.stringify({filename: `/data/${mode}/${targetFile}`}), {status: 200});
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {status: 500});
    }
}