import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../actions/events';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

const now = moment().minutes(0).second(0).add(1, 'hours');
const nowEnd = now.clone().add(1, 'hours');

const initEvent = {
  title: '',
  notes: '',
  start: now.toDate(),
  end: nowEnd.toDate()
};

export const CalendarModal = () => {

  const { modalOpen } = useSelector(state => state.ui );
  const { activeEvent } = useSelector( state => state.calendar );
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState(now.toDate());
  const [endDate, setEndDate] = useState(nowEnd.toDate());
  const [titleValid, setTitleValid] = useState(true);
  const [formValues, setFormValues] = useState(initEvent);

  const { notes, title, start, end } = formValues;

  useEffect(() => {
    if ( activeEvent ) {
      setFormValues( activeEvent );
    } else {
      setFormValues( initEvent );
    }
  }, [activeEvent, setFormValues])

  const inputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    });
  }

  const closeModal = () => {
    dispatch(uiCloseModal());
    dispatch(eventClearActiveEvent());
    setFormValues(initEvent);
  }

  const submitForm = (e) => {
    e.preventDefault();
    const momentStart = moment(start);
    const momentEnd = moment(end);
    if (momentStart.isSameOrAfter(momentEnd)) {
      return Swal.fire('Error', 'Ending date should be higher than starting date', 'error');
    }
    if (title.trim().length < 2) {
      return setTitleValid(false);
    }
    if(activeEvent) {
      dispatch( eventStartUpdate( formValues ) )
    }
    else {
      dispatch( eventStartAddNew(formValues) );
    }
    setTitleValid(true);
    closeModal();
  }
  
  const startDateChange = (e) => {
    setStartDate(e);
    setFormValues({
      ...formValues,
      start: e
    });
  }

  const endDateChange = (e) => {
    setEndDate(e);
    setFormValues({
      ...formValues,
      end: e
    });
  }

  return (
    <div>
      <Modal
        isOpen={ modalOpen }
        style={customStyles}
        onRequestClose={closeModal}

        className="modal"
        contentLabel="Example Modal"
        overlayClassName="modal-bg"
        ariaHideApp={false}
      >
        <h1> { (activeEvent) ? 'Edit event': 'New event' } </h1>
        <hr />
        <form 
          className="container"
          onSubmit={submitForm}
        >

          <div className="form-group">
              <label>Starting date and time</label>
              <DateTimePicker
                onChange={startDateChange}
                value={startDate}
                className="form-control"
              />
          </div>

          <div className="form-group">
            <label>Ending date and time</label>
            <DateTimePicker
              onChange={endDateChange}
              value={endDate}
              minDate={startDate}
              className="form-control"
            />
          </div>
          <hr />

          <div className="form-group">
            <label>Title and notes</label>
            <input 
              type="text" 
              className={`form-control ${!titleValid && 'is-invalid'}`}
              placeholder="Event title"
              name="title"
              autoComplete="off"
              value={ title }
              onChange={ inputChange }
            />
            <small id="emailHelp" className="form-text text-muted">A brief description</small>
          </div>

          <div className="form-group">
            <textarea 
              type="text" 
              className="form-control"
              placeholder="Notes"
              rows="5"
              name="notes"
              value={ notes }
              onChange={ inputChange }
            ></textarea>
            <small id="emailHelp" className="form-text text-muted">Aditonal Information</small>
          </div>

          <button
            type="submit"
            className="btn btn-outline-primary btn-block"
          >
            <i className="far fa-save"></i>
            <span> Save</span>
          </button>

        </form>
      </Modal>       
    </div>
  )
}
