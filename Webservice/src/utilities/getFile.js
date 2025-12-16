export async function getFile(mode, id){
    
    const rawMeta = await fetch(`/data/${mode}/level_meta.json`);
    const meta = await rawMeta.json();
    console.log(meta);
    
    const level = meta.find(line => String(line.id) === String(id));
    if (!level) return new Response(JSON.stringify({error: "File not found"}), {status: 400});
    console.log(level);

    const title = level.title.replace(" ", "_");
    console.log(`title: ${title}`);
    const filename = `${id}-${title}.json`;
    const path = `/data/${mode}/${filename}`
    console.log(path);
    
    return new Response(JSON.stringify({filename: path}), {status: 200});
}