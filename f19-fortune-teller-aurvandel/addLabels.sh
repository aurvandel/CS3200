for txt in names/*.txt; do
				sed -i '1i\name,gender,n' "$txt"
done
