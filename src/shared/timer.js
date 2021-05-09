export default function Timer(props) {

    return (
        <div className={props.time < 0 ? 'timer hidden' : 'timer'}>
            {props.time}
        </div>
    )

}