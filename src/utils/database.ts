import pgPromise from 'pg-promise';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const pgp = pgPromise();

export const db = pgp({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

type Row = Record<string, any>;

interface IInsertOptions {
    table: string;
    data: Row;
    returning?: string;      
}

interface IUpsertOptions {
    table: string;
    data: Row;
    conflictColumns: string[];
    updateColumns?: string[];  
    returning?: string;
}

interface IUpdateOptions {
    table: string;
    data: Row;                 
    where: Row;           
    returning?: string;
}

interface IBatchInsertOptions {
    table: string;
    data: Row[];            
    returning?: string;
}

interface ISoftDeleteOptions {
    table: string;
    where: Row;
    deletedBy: number;
    returning?: string;
}


class DbUtilityClass {


    getSQL(filePath: string): string {
        return fs.readFileSync(filePath, 'utf8');
    }

    async insert<T = Row>(options: IInsertOptions): Promise<T>{
        const {table, data, returning='*'} = options;

        const columns = Object.keys(data);
        const values  = Object.values(data);

        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const columnNames  = columns.map(c => `"${c}"`).join(', ');

        const query = `
            INSERT INTO ${table} (${columnNames})
            VALUES (${placeholders})
            RETURNING ${returning}
        `;

        logger.debug({ table, columns }, 'DB Insert');
        return db.one<T>(query, values);

    }

    async upsert<T = Row>(options: IUpsertOptions): Promise<T>{
        const { table, data, conflictColumns, returning = '*' } = options;
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const columnNames = columns.map(c => `"${c}"`).join(', ');
        const conflictCols = conflictColumns.map(c => `"${c}"`).join(', ');

        const updateCols = (options.updateColumns || columns.filter(c => !conflictColumns.includes(c)));
        const updateSet  = updateCols
            .map(c => `"${c}" = EXCLUDED."${c}"`)
            .join(', ');
        const query = `
            INSERT INTO ${table} (${columnNames})
            VALUES (${placeholders})
            ON CONFLICT (${conflictCols})
            DO UPDATE SET ${updateSet}
            RETURNING ${returning}
        `;

        logger.debug({ table, conflictColumns }, 'DB Upsert');
        return db.one<T>(query, values);

    }

    async update<T = Row>(options: IUpdateOptions): Promise<T | null> {
        const { table, data, where, returning = '*' } = options;
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        );
        if (Object.keys(filteredData).length === 0) {
            throw new Error('Update called with no fields to update');
        }
        const values: any[]  = [];
        let paramIndex = 1;

        const setClauses = Object.entries(filteredData).map(([col, val]) => {
            values.push(val);
            return `"${col}" = $${paramIndex++}`;
        });

        const whereClauses = Object.entries(where).map(([col, val]) => {
            values.push(val);
            return `"${col}" = $${paramIndex++}`;
        });

        const query = `
            UPDATE ${table}
            SET ${setClauses.join(', ')}, "updated_date" = CURRENT_TIMESTAMP
            WHERE ${whereClauses.join(' AND ')}
            RETURNING ${returning}
        `;

        logger.debug({ table, filteredData, where }, 'DB Update');
        return db.oneOrNone<T>(query, values);
    }

    async batchInsert<T = Row>(options: IBatchInsertOptions): Promise<T[]> {
        const { table, data, returning = '*' } = options;

        if (!data.length) return [];

        const columns = Object.keys(data[0]);
        const columnNames = columns.map(c => `"${c}"`).join(', ');

        const values: any[]  = [];
        let paramIndex = 1;

        const rowPlaceholders = data.map(row => {
            const placeholders = columns.map(col => {
                values.push(row[col]);
                return `$${paramIndex++}`;
            });
            return `(${placeholders.join(', ')})`;
        });

        const query = `
            INSERT INTO ${table} (${columnNames})
            VALUES ${rowPlaceholders.join(', ')}
            RETURNING ${returning}
        `;

        logger.debug({ table, rowCount: data.length }, 'DB Batch Insert');
        return db.many<T>(query, values);
    }

    async softDelete(options: ISoftDeleteOptions): Promise<boolean> {
        const { table, where, deletedBy, returning } = options;

        const values: any[] = [deletedBy];
        let paramIndex = 2;

        const whereClauses = Object.entries(where).map(([col, val]) => {
            values.push(val);
            return `"${col}" = $${paramIndex++}`;
        });

        const returningClause = returning ? `RETURNING ${returning}` : '';

        const query = `
            UPDATE ${table}
            SET "status" = FALSE,
                "updated_by" = $1,
                "updated_date" = CURRENT_TIMESTAMP
            WHERE ${whereClauses.join(' AND ')}
            ${returningClause}
        `;
        logger.debug({ table, where }, 'DB Soft Delete');
        const result = await db.result(query, values);
        return result.rowCount > 0;
    }

    async transaction<T>(callback: (t: any) => Promise<T>): Promise<T> {
        return db.tx(callback);
    }


}

export const dbUtility = new DbUtilityClass();
