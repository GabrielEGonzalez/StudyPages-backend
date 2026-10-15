import { Controller, Get , Param, Res , Body , Post, Put , Delete} from '@nestjs/common';
import type { Response } from 'express';
import { SubjectsService } from './subjects.service.js';
import { Prisma } from '../generated/prisma/browser.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';


@Controller('subjects')
export class SubjectsController {
    
    constructor(private subjectsService: SubjectsService) {}

    @Get()
    async getSubjects(@Res() res: Response) {
        try {
            const subjects = await this.subjectsService.getListOfSubjects();
            res.json({"subjects": subjects });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching subjects.' });
        }
    }

    @Get(':id')
    async getSubjectById(@Res() res: Response, @Param('id') id: string) {   
        try {
            const subject = await this.subjectsService.getSubjectById(id);
            if (!subject) {
                res.status(404).json({ error: 'Subject not found.' });
                return;
            }
            res.json({ subject });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching the subject.' });
        }
    }

    @Post()
    async createSubject(@Res() res: Response, @Body() data: CreateSubjectDto) {
        try {
            const subject = await this.subjectsService.createSubject(data);
            res.status(201).json({ subject });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the subject.' });
        }
    }

    @Put(':id')
    async updateSubject(@Res() res: Response, @Param('id') id: string,@Body() data: UpdateSubjectDto) {
        try {
            const subject = await this.subjectsService.updateSubject(id, data);
            res.json({ subject });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the subject.' });
        }
    }

    @Put(':id/restore')
    async restoreSubject(@Res() res: Response, @Param('id') id: string) {
        try {
            const subject = await this.subjectsService.restoreSubject(id);
            res.json({ subject });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while restoring the subject.' });
        }
    }

    @Delete(':id')
    async deleteSubject(@Res() res: Response, @Param('id') id: string) {
        try {
            const subject = await this.subjectsService.deleteSubject(id);
            res.json({ subject });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while deleting the subject.' });
        }
    }
}
