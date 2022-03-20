import SortBar from './SortBar';

const SortBox = (props) => {

    return (
        <div className="SortDiv">
            {props.bars.map((bar) => <SortBar height={bar} numBars={props.bars.length}></SortBar>)}
        </div>
    );
}

export default SortBox;