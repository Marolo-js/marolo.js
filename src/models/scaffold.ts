import { TemplatePlugin } from "../plugins/templatePlugin";
import { TemplateValidationError } from "../exceptions/TemplateValidationError";
import { IBasicTemplate } from "../interfaces/IBasicTemplate";
import fs from "fs";
import path from "path";
import { templateValidation } from "./templateValidation";

export function scaffold(plugin: TemplatePlugin) {
  const template = plugin.resolve();
  createFromTemplate(template, plugin.baseDir);
}

function createFromTemplate(template: IBasicTemplate, basePath: string) {
  const currentPath = path.join(basePath, template.name);

  templateValidation(template);

  if (template.type === "folder") {
    if (template.content) {
      throw new TemplateValidationError(
        "'folder' type nodes must not have content.",
      );
    }

    fs.mkdirSync(currentPath, { recursive: true });
    template.children?.forEach((child) =>
      createFromTemplate(child, currentPath),
    );
  } else if (template.type === "file") {
    if (template.children) {
      throw new TemplateValidationError(
        "'file' type nodes must not have children.",
      );
    }

    let content = template.content ?? "";
    fs.writeFileSync(currentPath, content);
  }
}
