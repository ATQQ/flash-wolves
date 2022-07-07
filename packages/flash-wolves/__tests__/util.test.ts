/* eslint-disable import/no-extraneous-dependencies */
import { test, expect } from 'vitest'
import { pathJoin } from '../src/utils'

test('pathJoin', () => {
  expect(pathJoin('a', 'b', 'c')).toBe('a/b/c')
  expect(pathJoin('a/', '/b/', 'c')).toBe('a/b/c')
  expect(pathJoin('/a', '/b/', 'c')).toBe('/a/b/c')
  expect(pathJoin('/a/', 'b/', 'c')).toBe('/a/b/c')
  expect(pathJoin('user', '', '')).toBe('user')
  expect(pathJoin('user', '')).toBe('user')
})
