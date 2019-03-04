import React from 'react';


class AuthorList extends React.Component {
	render() {
		let {author_list, year} = this.props
		let year_text = year || "In Press"
		let authors = author_list || '--'
		return authors + ` (${year_text})`
	}
}

AuthorList.defaultProps = {
	author_list: [],
	year: null
};

export default AuthorList;