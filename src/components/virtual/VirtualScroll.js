import React, {useEffect} from 'react';
import { isInView } from './utils';

const VirtualScroll = ({props}) => {
    const {className, minItemHeight, totalLength, renderItem } = props;

  const defaultProps = {
    buffer: 10,
    length: 30,
    offset: 0,
  }

  useEffect(() => {
    window.requestAnimationFrame(() => {
      if (this.listRef) {
        this.listRef.scrollTop = this.state.offset * this.avgRowHeight;
      }
    });
  }, []);

  useEffect(() =>{
    if (prevState.offset > this.state.offset) {
      this.updateOffset(prevState);
    }
  }, [_prevProps, prevState]);

  const updateOffset = (prevState) => {
    const offsetDiff = prevState.offset - this.state.offset;
    if (this.listRef) {
      const el = this.listRef;
      const items = el.querySelectorAll(".VS-item");

      let heightAdded = 0;
      let currOffset = prevState.offset;
      const start = Math.min(this.state.offset, this.props.buffer);
      const end = start + offsetDiff;
      for (let i = Math.min(items.length, end) - 1; i >= start; i--) {
        const inView = isInView(el, items[i]);
        if (inView) {
          currOffset--;
          const rowHeight = items[i].clientHeight;
          heightAdded += rowHeight;
        } else {
          break;
        }
      }

      if (items.length < end) {
        const diff = end - items.length;
        heightAdded += diff * minItemHeight;
        currOffset -= diff;
      }

      const newAvgRowHeight =
        currOffset === 0
          ? minItemHeight
          : (this.avgRowHeight * prevState.offset - heightAdded) / currOffset;

      this.setState({
        offset: currOffset,
      });
      this.avgRowHeight = Math.max(minItemHeight, newAvgRowHeight);
    }
  }

  const onScrollHandler = (event) => {
    if (this.listRef) {
      const {
        length,
        buffer
      } = this.props;

      const totalLength = 100;

      const {
        offset,
      } = this.state;

      const {
        avgRowHeight
      } = this;

      const el = this.listRef;
      const { scrollTop } = el;
      const direction = Math.floor(scrollTop - this.lastScrollTop);

      if (direction === 0) return;

      const items = el.querySelectorAll(".VS-item");
      let newOffset = offset;
      let newAvgRowHeight = avgRowHeight;
      const start = Math.min(offset, buffer);
      if (direction > 0) {
        if (offset < totalLength - length) {
          let heightAdded = 0;
          for (let i = start; i < items.length; i++) {
            const inView = isInView(el, items[i]);
            const rowHeight = items[i].clientHeight;
            if (!inView) {
              heightAdded += rowHeight;
              newOffset++;
            } else {
              break;
            }
          }
          if (heightAdded < direction) {
            const heightLeft = direction - heightAdded;
            const offsetToBeAdded = Math.floor(heightLeft / minItemHeight)
            newOffset += offsetToBeAdded;
            heightAdded += offsetToBeAdded * minItemHeight
          }
          newAvgRowHeight = newOffset > 0
            ? ((offset * avgRowHeight) + (heightAdded)) / newOffset
            : minItemHeight;

          this.setState({
            offset: Math.min(newOffset, totalLength - length),
          });
          this.avgRowHeight = Math.max(minItemHeight, newAvgRowHeight);
        }
      } else {
        const scrollDiff = items[start].getBoundingClientRect().y - el.getBoundingClientRect().y;
        if (scrollDiff > 0) {
          const offsetDiff = Math.floor(scrollDiff / minItemHeight) || 1;
          const newOffset = offset - offsetDiff;
          if (newOffset < totalLength - (length + buffer)) {
            this.setState({
              offset: Math.max(0, newOffset),
            });
          }
        }
      }

      this.lastScrollTop = scrollTop;
    }

    if (this.props.onScroll) this.props.onScroll(event);
  }

  const renderItems = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, index) => {
      const rowIndex = start + index;
      const component = renderItem(rowIndex);
      return React.cloneElement(
        component,
        {
          key: rowIndex,
          className: ["VS-item", className].join(' ').trim()
        }
      );
    })
  }

    const {
      avgRowHeight
    } = this;

    const start = Math.max(0, offset - buffer);
    const end = Math.min(offset + (length + buffer) - 1, totalLength - 1);

    const topPadding = Math.max(0, start * avgRowHeight);
    const bottomPadding = Math.max(0, (totalLength - end - 1) * avgRowHeight);

    return (
      <div
        {...rest}
        ref={(el) => {
          this.listRef = el;
          if (forwardRef) forwardRef.current = el;
          if (!init) this.setState({ init: true });
        }}
        onScroll={onScrollHandler}
      >
        {init && (
          <>
            <div
              style={{
                flexShrink: 0,
                height: topPadding
              }}
            />
            {renderItems(start, end)}
            <div
              style={{
                flexShrink: 0,
                height: bottomPadding
              }}
            />
          </>
        )}
      </div>
    );
  
}

export default React.forwardRef((props, ref) => <VirtualScroll key={props.totalLength} forwardRef={ref} {...props} />);