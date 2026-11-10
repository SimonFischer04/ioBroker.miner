import { expect } from 'chai';
import {
    coerceCustomFeatureValue,
    findDynamicCustomChannel,
    instantiateDynamicCustomChannel,
    resolveCustomFeatures,
    type CustomFeatureDefinition,
    type DynamicCustomChannelDefinition,
} from '../model/CustomFeature';

const base = { label: 'Feature', description: 'test', readable: true, writable: true } as const;

describe('resolveCustomFeatures', () => {
    it('prefixes each feature id with its channel', () => {
        const resolved = resolveCustomFeatures([
            { id: 'light', label: 'Light', features: [{ ...base, id: 'on', type: 'boolean' }] },
            { id: 'lcd', label: 'Display', features: [{ ...base, id: 'on', type: 'boolean' }] },
        ]);
        expect(resolved.map(f => f.id)).to.deep.equal(['light.on', 'lcd.on']);
        expect(resolved[1].channel.label).to.equal('Display');
    });
});

describe('coerceCustomFeatureValue', () => {
    const bool: CustomFeatureDefinition = { ...base, id: 'on', type: 'boolean' };
    const num: CustomFeatureDefinition = { ...base, id: 'level', type: 'number', min: 0, max: 100 };
    const text: CustomFeatureDefinition = { ...base, id: 'color', type: 'string' };
    const select: CustomFeatureDefinition = { ...base, id: 'effect', type: 'number', states: { 1: 'A', 2: 'B' } };

    it('accepts booleans and their usual spellings', () => {
        expect(coerceCustomFeatureValue(bool, true)).to.equal(true);
        expect(coerceCustomFeatureValue(bool, 0)).to.equal(false);
        expect(coerceCustomFeatureValue(bool, 'true')).to.equal(true);
        expect(() => coerceCustomFeatureValue(bool, 'yes')).to.throw('expects true or false');
    });

    it('accepts numbers within range, also given as text', () => {
        expect(coerceCustomFeatureValue(num, 42)).to.equal(42);
        expect(coerceCustomFeatureValue(num, '42')).to.equal(42);
        expect(() => coerceCustomFeatureValue(num, 101)).to.throw('between 0 and 100');
        expect(() => coerceCustomFeatureValue(num, -1)).to.throw('between 0 and 100');
        expect(() => coerceCustomFeatureValue(num, '')).to.throw('expects a number');
        expect(() => coerceCustomFeatureValue(num, null)).to.throw('expects a number');
    });

    it('accepts text only for text features', () => {
        expect(coerceCustomFeatureValue(text, '#ff0000')).to.equal('#ff0000');
        expect(() => coerceCustomFeatureValue(text, 5)).to.throw('expects a text');
    });

    it('accepts only the listed states', () => {
        expect(coerceCustomFeatureValue(select, 2)).to.equal(2);
        expect(coerceCustomFeatureValue(select, '1')).to.equal(1);
        expect(() => coerceCustomFeatureValue(select, 3)).to.throw('must be one of 1, 2');
    });

    it('rejects writes to read-only features', () => {
        expect(() => coerceCustomFeatureValue({ ...bool, writable: false }, true)).to.throw('read-only');
    });
});

describe('dynamic custom channels', () => {
    const template: DynamicCustomChannelDefinition = {
        id: 'hashboard',
        label: 'Hashboard',
        features: [{ id: 'temp', label: 'Temp', description: '', type: 'number', readable: true, writable: false }],
    };

    it('names an instance after the template and the instance id', () => {
        expect(instantiateDynamicCustomChannel(template, '2')).to.deep.equal({
            id: 'hashboard2',
            label: 'Hashboard 2',
            features: template.features,
        });
    });

    it('keeps an instance id from creating extra levels or invalid object ids', () => {
        expect(instantiateDynamicCustomChannel(template, 'a.b c').id).to.equal('hashboarda_b_c');
    });

    it('finds the template of an instance, but not of the template id alone or another channel', () => {
        expect(findDynamicCustomChannel([template], 'hashboard1')).to.equal(template);
        expect(findDynamicCustomChannel([template], 'hashboard')).to.be.undefined;
        expect(findDynamicCustomChannel([template], 'light')).to.be.undefined;
    });
});
