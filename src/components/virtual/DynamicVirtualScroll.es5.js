"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Virtual scroll driver for dynamic row heights
 *
 * License: GNU LGPLv3.0+
 * (c) Vitaliy Filippov 2018+
 *
 * @param props { totalItems, minRowHeight, viewportHeight, scrollTop }
 * @param oldState - previous state object
 * @param getRenderedItemHeight = (itemIndex) => height
 *     this function MUST return the height of currently rendered item or 0 if it's not currently rendered
 *     the returned height MUST be >= props.minRowHeight
 *     the function MAY cache heights of rendered items if you want your list to be more responsive
 * @returns new state object
 *     you MUST re-render your list when any state values change
 *     you MUST preserve all keys in the state object and pass it back via `oldState` on the next run
 *     you MUST use the following keys for rendering:
 *         newState.targetHeight - height of the 1px wide invisible div you should render in the scroll container
 *         newState.topPlaceholderHeight - height of the first (top) placeholder. omit placeholder if it is 0
 *         newState.firstMiddleItem - first item to be rendered after top placeholder
 *         newState.middleItemCount - item count to be renderer after top placeholder. omit items if it is 0
 *         newState.middlePlaceholderHeight - height of the second (middle) placeholder. omit placeholder if it is 0
 *         newState.lastItemCount - item count to be rendered in the end of the list
 */
const virtualScrollDriver = (props, oldState, getRenderedItemHeight) => {
    var viewportHeight = props.viewportHeight;
    var viewportItemCount = Math.ceil(viewportHeight / props.minRowHeight); // +border?
    var newState = {
        viewportHeight: viewportHeight,
        viewportItemCount: viewportItemCount,
        totalItems: props.totalItems,
        scrollHeightInItems: oldState.scrollHeightInItems,
        avgRowHeight: oldState.avgRowHeight,
        targetHeight: 0,
        topPlaceholderHeight: 0,
        firstMiddleItem: 0,
        middleItemCount: 0,
        middlePlaceholderHeight: 0,
        lastItemCount: props.totalItems,
        lastItemsTotalHeight: oldState.lastItemsTotalHeight
    };
    if (!oldState.viewportHeight) {
        oldState = _extends({}, oldState);
        for (var k in newState) {
            oldState[k] = oldState[k] || 0;
        }
    }
    if (2 * newState.viewportItemCount >= props.totalItems) {
        // We need at least 2*viewportItemCount to perform virtual scrolling
        return newState;
    }
    newState.lastItemCount = newState.viewportItemCount;
  
    newState.targetHeight = newState.avgRowHeight * newState.scrollHeightInItems + newState.viewportHeight;
    var scrollTop = props.scrollTop;
    var scrollPos = scrollTop / (newState.targetHeight - newState.viewportHeight);
    if (scrollPos > 1) {
        // Rare case - avgRowHeight isn't enough and we need more
        // avgRowHeight will be corrected after rendering all items
        scrollPos = 1;
    }
    var firstVisibleItem = scrollPos * newState.scrollHeightInItems;
    var firstVisibleItemOffset = firstVisibleItem - Math.floor(firstVisibleItem);
    // FIXME: Render some items before current for smoothness
    firstVisibleItem = Math.floor(firstVisibleItem);
    var firstVisibleItemHeight = getRenderedItemHeight(firstVisibleItem) || newState.avgRowHeight;
    newState.topPlaceholderHeight = scrollTop - firstVisibleItemHeight * firstVisibleItemOffset;
    if (newState.topPlaceholderHeight < 0) {
        newState.topPlaceholderHeight = 0;
    }
    if (firstVisibleItem + newState.viewportItemCount >= props.totalItems - newState.viewportItemCount) {
        // Only one placeholder is required
        newState.lastItemCount = props.totalItems - firstVisibleItem;
        var sum = 0,
            count = props.totalItems - newState.viewportItemCount - firstVisibleItem;
        count = count > 0 ? count : 0;
        for (var i = 0; i < count; i++) {
            var itemSize = getRenderedItemHeight(i + newState.firstMiddleItem);
            if (!itemSize) {
                // Some required items in the middle are missing
                return newState;
            }
            sum += itemSize;
        }
        var correctedAvg = (sum + newState.lastItemsTotalHeight) / (count + newState.viewportItemCount);
        if (correctedAvg > newState.avgRowHeight) {
            newState.avgRowHeight = correctedAvg;
        }
    } else {
        newState.firstMiddleItem = firstVisibleItem;
        newState.middleItemCount = newState.viewportItemCount;
        var _sum = 0;
        for (var _i = 0; _i < newState.middleItemCount; _i++) {
            var _itemSize = getRenderedItemHeight(_i + newState.firstMiddleItem);
            if (!_itemSize) {
                // Some required items in the middle are missing
                return newState;
            }
            _sum += _itemSize;
        }
        newState.middlePlaceholderHeight = newState.targetHeight - _sum - newState.lastItemsTotalHeight - newState.topPlaceholderHeight;
        if (newState.middlePlaceholderHeight < 0) {
            newState.middlePlaceholderHeight = 0;
        }
        var _correctedAvg = (_sum + newState.lastItemsTotalHeight) / (newState.middleItemCount + newState.viewportItemCount);
        if (_correctedAvg > newState.avgRowHeight) {
            newState.avgRowHeight = _correctedAvg;
        }
    }
    return newState;
}

export default virtualScrollDriver;

