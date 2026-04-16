import { Injectable } from '@nestjs/common';
import { HelloEmailDTO } from './dto';
import { join } from 'path';
import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';

type renderTypes = HelloEmailDTO;

@Injectable()
export class EmailTemplateService {
  private readonly templates = join(__dirname, 'templates');

  public async render(data: renderTypes): Promise<string> {
    const filePath = join(this.templates, `${data.template}.hbs`);
    const template = await readFile(filePath, 'utf-8');
    const delegate = Handlebars.compile(template);

    return delegate(data);
  }
}
