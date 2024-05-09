import { isNull } from '@/baekjoon/utils/utils';
import { getStats, saveStats } from './storage';

class TTLCacheStats {
    name: string;
    stats: any;
    saveTimer: any;

    constructor(name: string) {
        this.name = name;
        this.stats = null;
        this.saveTimer = null;
    }

    async forceLoad() {
        this.stats = await getStats();
        if (isNull(this.stats[this.name])) {
            this.stats[this.name] = {};
        }
    }

    async load() {
        if (this.stats === null) {
            await this.forceLoad();
        }
    }

    async save() {
        if (this.saveTimer) {
            clearTimeout(this.saveTimer);
        }
        this.saveTimer = setTimeout(async () => {
            const clone = this.stats[this.name];
            await this.forceLoad();
            this.stats[this.name] = clone;
            await saveStats(this.stats);
            this.saveTimer = null;
        }, 1000);
    }

    async expired() {
        await this.load();
        if (!this.stats[this.name].last_check_date) {
            this.stats[this.name].last_check_date = Date.now();
            this.save();
            console.log(
                'Initialized stats date',
                this.stats[this.name].last_check_date
            );
            return;
        }

        const date_yesterday = Date.now() - 86400000;
        if (date_yesterday < this.stats[this.name].last_check_date) return;

        this.stats[this.name].last_check_date = Date.now();
        await this.save();
    }

    async update(data: any) {
        await this.expired();
        await this.load();
        this.stats[this.name][data.id] = {
            ...data,
            save_date: Date.now(),
        };
        await this.save();
    }

    async get(id: any) {
        await this.load();
        const cur = this.stats[this.name];
        if (isNull(cur)) return null;
        return cur[id];
    }
}

const problemCache = new TTLCacheStats('problem');
const SolvedACCache = new TTLCacheStats('solvedac');

export const updateProblemsFromStats = async (problem: any) => {
    const data = {
        id: problem.problemId,
        problem_description: problem.problem_description,
        problem_input: problem.problem_input,
        problem_output: problem.problem_output,
    };
    await problemCache.update(data);
};

export const getProblemFromStats = async (problemId: any) => {
    return problemCache.get(problemId);
};

export const updateSolvedACFromStats = async (obj: any) => {
    const data = {
        id: obj.problemId,
        data: obj.jsonData,
    };
    await SolvedACCache.update(data);
};

export const getSolvedACFromStats = async (problemId: any) => {
    return SolvedACCache.get(problemId).then((x) => x?.data);
};
