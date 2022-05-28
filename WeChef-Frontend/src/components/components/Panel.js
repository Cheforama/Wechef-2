import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import DataTable from "react-data-table-component";
import { Link } from "@reach/router";
import { useSelector } from "react-redux";

const Panel = (props) => {

    const { account } = useSelector(state => state.wallet);
    const [show, setShow] = useState(props.default);

    return (
        <div className="panel">
            <div
                className="p-3 cursor-pointer panel-title d-flex align-items-center justify-content-between"
                style={show ? { borderBottom: '1px solid rgba(0,0,0,.125)', backgroundColor: 'rgb(231, 241, 255)' } : { borderBottom: 'none', backgroundColor: 'rgb(231, 241, 255)' }}
                onClick={() => setShow(!show)}
            >
                <span className="d-flex align-items-center">{props.icon}&nbsp;{props.title}</span>
                <div className="d-flex align-items-center">
                    {
                        props.isViewAll && <Link to={props.link} style={{ fontSize: '16px' }}>View All</Link>
                    }
                    &nbsp;
                    <span>
                        {
                            !show ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />
                        }
                    </span>
                </div>
            </div>
            {
                show && (
                    <div className="p-3">
                        <DataTable
                            columns={props.header}
                            data={props.data}
                            noHeader
                            pagination
                            paginationRowsPerPageOptions={[5, 10, 20, 50]}
                            paginationPerPage={5}
                            responsive={true}
                            theme="light"
                        />
                    </div>
                )
            }
        </div>
    )
}

export default Panel;