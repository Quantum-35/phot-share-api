import React, { Component } from 'react';

import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

interface iProps {

}

const POST_PHOTO_MUTATION = gql`
    mutation postPhoto($input: PostPhotoInput!) {
    postPhoto(input: $input) {
        id
        name
        category
        description
    }
}
`;

export class PostPhoto extends Component<iProps> {
    state = {
        name: '',
        description: '',
        category: 'SELFIE',
        file: ''
    }

    handleOnchange = (e:any) => {
        const {value, name} = e.target;
        this.setState({
            [name]: value
        });
    }

    handleSubmitForm = async(mutation:any) => {
        try {
            await mutation({
                variables: {
                    input: this.state
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        console.log(this.state)
        return (
        <div style={{position: "absolute", top: "3rem", zIndex: 3, right: "20rem", border: "1px solid green"}}>
            <form>
                <h2 style={{textDecoration: "underline"}}>Post a Photo</h2><br />
                <input type="text" name="name" placeholder="Name" id="name" onChange={this.handleOnchange}/><br />
                <input type="text" name="description" placeholder="description" id="description" onChange={this.handleOnchange}/><br />
                <select name="category" id="category" value={this.state.category} onChange={this.handleOnchange}>
                    <option value="SELFIE">SELFIE</option>
                    <option value="PORTRAIT">PORTRAIT</option>
                    <option value="ACTION">ACTION</option>
                    <option value="LANDSCAPE">LANDSCAPE</option>
                    <option value="GRAPHIC">GRAPHIC</option>
                </select> <br />
                <input type="file" name="file" accept="image/jpeg" id="file" onChange={this.handleOnchange}/><br /> <br />
                <div>
                    <Mutation mutation={POST_PHOTO_MUTATION}>
                        {
                            (mutation:any) => 
                                <button type="submit" onClick={ () => this.handleSubmitForm(mutation)}>Post new Photo</button>
                        }
                    </Mutation>
                </div>
            </form>
        </div>
        )
    }
}

export default PostPhoto;