import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Basic test to assure Vitest runner works
describe('Basic Frontend Setup', () => {
    it('Should pass a sanity check', () => {
        expect(1 + 1).toBe(2);
    });
});
