import React, { Component } from 'react'
// import items from './data'
import FeaturedRooms from './components/FeaturedRooms';
import Client from './Contentful'

const RoomContext = React.createContext();
// Provider

class RoomProvider extends Component {
    state = {
        rooms: [],
        sortedRooms: [],
        featuredRooms: [],
        loading: true,
        type: 'all',
        capacity: 1,
        price: 0,
        minPrice: 0,
        maxPrice: 0,
        minSize: 0,
        maxSize: 0,
        breakfast: false,
        pets: false
    };

    // getData
    getData = async () => {
        try {
            let response = await Client.getEntries({
                content_type: "beachResortRoom",
                order: 'sys.createdAt'
            })
            let rooms = this.formatData(response.items)
            // got featured rooms
            let featuredRooms = rooms.filter(room => room.featured === true)
            let maxPrice = Math.max(...rooms.map(item => item.price))
            let maxSize = Math.max(...rooms.map(item => item.size))
            // we set State featured rooms and just rooms
            this.setState({
                rooms, featuredRooms, sortedRooms: rooms, loading: false, price: maxPrice, maxPrice, maxSize
            });
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.getData()
    }

    formatData(items) {
        let tempItems = items.map(item => {
            let id = item.sys.id;
            //array of images 
            let images = item.fields.images.map(image => image.fields.file.url)

            let room = { ...item.fields, images, id }
            return room;
        });
        return tempItems;
    }

    getRoom = (slug) => {
        let tempRooms = [...this.state.rooms];
        // finding room with matched slug(e.g. /presidential-room)
        // from all rooms
        const room = tempRooms.find(room => room.slug === slug)
        return room;
    }

    handleChange = (event) => {
        const target = event.target; // the whole <select>
        const value = target.type === 'checkbox' ? // value is family or double or presidential or 1,2,3, event.type is "change"
            target.checked : target.value
        const name = event.target.name // "type" or "capacity" or "price"
        this.setState({
            [name]: value // type: "double" or capacity: 3 or price: 300
        }, this.filterRooms)
    }

    filterRooms = () => {
        let {
            rooms,
            type,
            capacity,
            price,
            minSize,
            maxSize,
            breakfast,
            pets
        } = this.state;
        // all the rooms
        let tempRooms = [...rooms];
        // transform capacity and price value
        capacity = parseInt(capacity)
        price = parseInt(price)

        // filter by type
        if (type !== 'all') {
            tempRooms = tempRooms.filter(room => room.type === type)
        }

        // filter by capacity
        if (capacity !== 1) {
            tempRooms = tempRooms.filter(room => room.capacity >= capacity)
        }

        // filter by price
        tempRooms = tempRooms.filter(room => room.price <= price)

        // filter by size
        tempRooms = tempRooms.filter(room => room.size >= minSize && room.size <= maxSize)

        // filter by breakfast
        if (breakfast) {
            tempRooms = tempRooms.filter(room => room.breakfast === true)
        }

        // filter by pets
        if (pets) {
            tempRooms = tempRooms.filter(room => room.pets === true)
        }
        // setting the state
        this.setState({
            sortedRooms: tempRooms
        })
    }

    render() {
        return (
            <RoomContext.Provider value={{ ...this.state, getRoom: this.getRoom, handleChange: this.handleChange }}>
                {this.props.children}
            </RoomContext.Provider>
        )
    }
}

const RoomConsumer = RoomContext.Consumer;

export { RoomProvider, RoomConsumer, RoomContext }