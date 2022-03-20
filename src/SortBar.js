const SortBar = (props) => {
    const style = {
        'height': props.height+"px",
        'width': props.numBars+"%",
        'backgroundColor': `rgb(${(props.height*1.3)}, ${(255 - Math.abs(127 - props.height*1.3))}, ${255 - props.height*1.3})`
    }
    return (
        <div style={style} className="SortBar">
        </div>
    );
}

export default SortBar;