# React Query Optimization Guide

## Overview

This guide explains the React Query optimization implemented to fix repeated requests when navigating between pages.

## Problem Solved

**Before**: Each page component was making its own API calls in `useEffect` hooks without any caching or deduplication mechanism. When navigating between pages, each page re-fetched its data, causing repeated requests.

**After**: React Query (TanStack Query) provides intelligent caching, request deduplication, and background updates.

## Key Changes

### 1. React Query Provider Setup

- **File**: `src/providers/QueryProvider.tsx`
- **Purpose**: Global React Query configuration with optimized settings
- **Features**:
  - 5-minute stale time (data considered fresh for 5 minutes)
  - 10-minute garbage collection time
  - Disabled refetch on window focus
  - Enabled refetch on reconnect

### 2. Optimized Hooks

#### `use-courses-query.ts`
- **Replaces**: `use-courses.ts`
- **Features**:
  - Automatic caching of courses and categories
  - Optimistic updates for mutations
  - localStorage integration for offline access
  - Request deduplication

#### `use-notes-query.ts`
- **Replaces**: `use-notes.ts`
- **Features**:
  - Cached note fetching
  - Optimistic updates for CRUD operations
  - Image cleanup on note updates

#### `use-files-query.ts`
- **Replaces**: `use-files.ts`
- **Features**:
  - Course-specific file caching
  - File preview functionality
  - Bulk file operations

#### `use-dashboard-query.ts`
- **Replaces**: `use-dashboard.tsx`
- **Features**:
  - Parallel data fetching
  - Individual query keys for each data type
  - Optimized loading states

### 3. Updated Components

All page components have been updated to use the new optimized hooks:

- `courses/page.tsx` - Uses `useCourses` from `use-courses-query`
- `notes/page.tsx` - Uses `useNotes` from `use-notes-query`
- `dashboard/page.tsx` - Uses `useDashboardData` from `use-dashboard-query`
- `courses/[courseId]/page.tsx` - Uses `useCourse` and `useFiles` from optimized hooks

## Benefits

### 1. **Request Deduplication**
- Multiple components requesting the same data will share a single request
- No more duplicate API calls when navigating between pages

### 2. **Intelligent Caching**
- Data is cached for 5 minutes by default
- Stale data is shown immediately while fresh data loads in background
- Automatic cache invalidation on mutations

### 3. **Better User Experience**
- Instant navigation between pages (cached data)
- Background updates keep data fresh
- Optimistic updates for immediate feedback

### 4. **Performance Improvements**
- Reduced server load
- Faster page transitions
- Better network utilization

## Usage Examples

### Basic Data Fetching
```typescript
// Old way
const { courses, loading, error, fetchCourses } = useCourses();
useEffect(() => {
  fetchCourses();
}, [fetchCourses]);

// New way
const { courses, loading, error } = useCourses();
// Data is automatically fetched and cached
```

### Mutations with Optimistic Updates
```typescript
// Old way
const addCourse = async (courseData) => {
  const newCourse = await createCourse(courseData);
  fetchCourses(); // Refetch all data
};

// New way
const { addCourse } = useCourses();
const handleAdd = async (courseData) => {
  await addCourse(courseData);
  // UI updates immediately, cache is updated automatically
};
```

### Single Item Fetching
```typescript
// New optimized way
const { data: course, isLoading, error } = useCourse(courseId);
```

## Cache Management

### Cache Status Component
- **File**: `src/components/ui/CacheStatus.tsx`
- **Purpose**: Debug and monitor cache state
- **Usage**: Shows in top-right corner of main layout
- **Features**:
  - Display cache statistics
  - Clear cache manually
  - Monitor active queries

### Cache Keys
Consistent query keys ensure proper cache management:

```typescript
// Courses
courseKeys.lists() // ['courses', 'list']
courseKeys.detail(id) // ['courses', 'detail', id]
courseKeys.categories // ['courseCategories']

// Notes
noteKeys.lists() // ['notes', 'list']
noteKeys.detail(id) // ['notes', 'detail', id]
noteKeys.byCourse(courseId) // ['notes', 'course', courseId]

// Files
fileKeys.byCourse(courseId) // ['files', 'list', courseId]
```

## Migration Guide

### For New Components
1. Use the `-query` suffixed hooks instead of the original ones
2. Remove manual `useEffect` calls for data fetching
3. Use the returned loading and error states directly

### For Existing Components
1. Replace import statements to use new hooks
2. Remove `fetchCourses()`, `loadNotes()`, etc. calls from `useEffect`
3. Update mutation handlers to use the new mutation functions

### Example Migration
```typescript
// Before
import { useCourses } from '@/hooks/use-courses';
const { courses, fetchCourses } = useCourses();
useEffect(() => {
  fetchCourses();
}, [fetchCourses]);

// After
import { useCourses } from '@/hooks/use-courses-query';
const { courses } = useCourses();
// No useEffect needed - data is automatically fetched
```

## Debugging

### React Query DevTools
- Available in development mode
- Shows all queries and mutations
- Monitor cache state and performance

### Cache Status Component
- Real-time cache statistics
- Manual cache clearing
- Query count monitoring

### Network Tab
- Reduced network requests
- Cached responses
- Background refetching

## Best Practices

1. **Use the optimized hooks** instead of the original ones
2. **Don't manually refetch** - React Query handles this automatically
3. **Trust the cache** - data is kept fresh automatically
4. **Use mutations** for data changes - they update the cache automatically
5. **Monitor cache status** during development to understand the system

## Performance Monitoring

The cache status component helps monitor:
- Total queries in cache
- Active queries
- Stale queries
- Total mutations

This provides insight into the caching system's effectiveness and helps identify potential issues. 