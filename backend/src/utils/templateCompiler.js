import handlebars from "handlebars";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const compileTemplate = (templateName, data) => {
    const filePath = path.join(__dirname, '../templates', `${templateName}.html`);
    const templateString = fs.readFileSync(filePath, 'utf-8');

    const template = handlebars.compile(templateString);

    return template(data);
};

export default compileTemplate;
