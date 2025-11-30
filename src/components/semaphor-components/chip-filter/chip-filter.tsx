import { CustomFilterProps, TSelectedRecord } from '../../config-types';

/**
 * ChipFilter - A custom filter that displays options as clickable chips.
 *
 * This is an example custom filter component for the Semaphor plugin system.
 * Custom filters are purely presentational - all filter logic (cascading,
 * scoping, SQL operations) is handled by the host application through
 * the provided callbacks.
 */
export function ChipFilter({
  options,
  selectedValues,
  onChange,
  onClear,
  onSelectAll,
  searchQuery,
  onSearchChange,
  isLoading,
  isFetching,
  isSearching,
  isSingleSelect,
  allSelected,
  theme,
  settings,
}: CustomFilterProps) {
  // Get settings with defaults
  const showSearch = settings?.showSearch !== false;
  const maxVisibleChips = Number(settings?.maxVisibleChips) || 20;
  const chipStyle = (settings?.chipStyle as string) || 'rounded';

  // Handle chip click
  const handleChipClick = (record: TSelectedRecord) => {
    const isSelected = selectedValues.some((v) => v.value === record.value);

    if (isSingleSelect) {
      // Single select: replace selection
      onChange(isSelected ? [] : [record]);
    } else {
      // Multi select: toggle selection
      if (isSelected) {
        onChange(selectedValues.filter((v) => v.value !== record.value));
      } else {
        onChange([...selectedValues, record]);
      }
    }
  };

  // Check if a value is selected
  const isSelected = (record: TSelectedRecord) =>
    selectedValues.some((v) => v.value === record.value);

  // Limit visible options
  const visibleOptions = options.slice(0, maxVisibleChips);
  const hiddenCount = options.length - visibleOptions.length;

  // Chip border radius based on style setting
  const chipBorderRadius =
    chipStyle === 'square' ? '4px' : chipStyle === 'pill' ? '9999px' : '8px';

  // Dynamic colors based on theme
  const isDark = theme?.mode === 'dark';
  const selectedBg = theme?.colors?.[0] || (isDark ? '#3b82f6' : '#2563eb');
  const selectedText = '#ffffff';
  const unselectedBg = isDark ? '#374151' : '#f3f4f6';
  const unselectedText = isDark ? '#e5e7eb' : '#374151';

  return (
    <div
      className="chip-filter"
      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
    >
      {/* Search input */}
      {showSearch && onSearchChange && (
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            style={{
              width: '100%',
              padding: '6px 12px',
              fontSize: '14px',
              border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              color: isDark ? '#e5e7eb' : '#111827',
              outline: 'none',
            }}
          />
          {isSearching && (
            <span
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '12px',
                color: isDark ? '#9ca3af' : '#6b7280',
              }}
            >
              ...
            </span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
        {!isSingleSelect && onSelectAll && (
          <button
            onClick={() => onSelectAll(!allSelected)}
            style={{
              padding: '4px 8px',
              background: 'none',
              border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        )}
        {selectedValues.length > 0 && (
          <button
            onClick={onClear}
            style={{
              padding: '4px 8px',
              background: 'none',
              border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            Clear ({selectedValues.length})
          </button>
        )}
      </div>

      {/* Loading state */}
      {(isLoading || isFetching) && (
        <div
          style={{
            fontSize: '12px',
            color: isDark ? '#9ca3af' : '#6b7280',
            padding: '8px 0',
          }}
        >
          Loading options...
        </div>
      )}

      {/* Chips container */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          maxHeight: '200px',
          overflowY: 'auto',
          padding: '4px 0',
        }}
      >
        {visibleOptions.map((record) => (
          <button
            key={String(record.value)}
            onClick={() => handleChipClick(record)}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: chipBorderRadius,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              backgroundColor: isSelected(record) ? selectedBg : unselectedBg,
              color: isSelected(record) ? selectedText : unselectedText,
            }}
          >
            {record.label || String(record.value)}
          </button>
        ))}
      </div>

      {/* Hidden count */}
      {hiddenCount > 0 && (
        <div
          style={{
            fontSize: '12px',
            color: isDark ? '#9ca3af' : '#6b7280',
            fontStyle: 'italic',
          }}
        >
          +{hiddenCount} more options (use search to find them)
        </div>
      )}
    </div>
  );
}
