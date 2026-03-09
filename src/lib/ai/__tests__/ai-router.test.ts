
import { describe, it, expect } from 'vitest';
import {
    getEnabledToolsForPlan,
    checkMessageLimit,
} from '../AIRouter';

describe('AIRouter', () => {
    describe('checkMessageLimit', () => {
        it('should always allow messages (no limits for internal app)', () => {
            expect(checkMessageLimit('ultimate', 0).allowed).toBe(true);
            expect(checkMessageLimit('ultimate', 10000).allowed).toBe(true);
            expect(checkMessageLimit('ultimate', 999999).allowed).toBe(true);
        });

        it('should return Infinity for remaining', () => {
            const result = checkMessageLimit('ultimate', 100);
            expect(result.remaining).toBe(Infinity);
            expect(result.limit).toBe(Infinity);
        });
    });

    describe('getEnabledToolsForPlan', () => {
        it('should return all tools', () => {
            const tools = getEnabledToolsForPlan('ultimate');
            expect(tools).toContain('search_properties');
            expect(tools).toContain('calculate_loan');
            expect(tools).toContain('schedule_viewing');
            expect(tools).toContain('create_lead');
            expect(tools).toContain('collect_contact_info');
            expect(tools).toContain('request_human_support');
            expect(tools).toContain('remember_preference');
        });
    });
});
