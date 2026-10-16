// src/pages/dto/update-page.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePageDto } from './create-page.dto.js';

export class UpdatePageDto extends PartialType(CreatePageDto) {}